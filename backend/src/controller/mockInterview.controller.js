const mockInterviewModel = require("../models/mockInterview.model");
const interviewReportModel = require("../models/interviewReport.model");

const {
    generateMockInterviewQuestions,
    evaluateMockInterviewAnswer,
    generateMockInterviewSummary,
    identifyWeakAreas
} = require("../services/groq.service");


async function startMockInterview(req, res) {

    try {

        const { interviewReportId } = req.body;

        if (!interviewReportId) {

            return res.status(400).json({
                success: false,
                message: "Interview report ID is required"
            });

        }


        // Find report belonging to logged-in user

        const interviewReport =
            await interviewReportModel.findOne({
                _id: interviewReportId,
                user: req.user.id
            });


        if (!interviewReport) {

            return res.status(404).json({
                success: false,
                message: "Interview report not found"
            });

        }


        // Generate mock interview questions using AI

        const questions =
            await generateMockInterviewQuestions({
                jobDescription: interviewReport.jobDescription,
                resume: interviewReport.resume,
                selfDescription: interviewReport.selfDescription,
                technicalQuestions:
                    interviewReport.technicalQuestions,
                behavioralQuestions:
                    interviewReport.behavioralQuestions
            });


        if (!questions || questions.length === 0) {

            return res.status(500).json({
                success: false,
                message: "Failed to generate mock interview questions"
            });

        }


        // Create mock interview session

        const mockInterview =
            await mockInterviewModel.create({

                user: req.user.id,

                interviewReport: interviewReport._id,

                questions,

                answers: [],

                currentQuestionIndex: 0,

                status: "in-progress"

            });


        return res.status(201).json({

            success: true,

            message: "Mock interview started successfully",

            mockInterview: {

                _id: mockInterview._id,

                currentQuestion:
                    questions[0],

                currentQuestionIndex: 0,

                totalQuestions:
                    questions.length,

                status:
                    mockInterview.status

            }

        });


    } catch (error) {

        console.error(
            "❌ Start Mock Interview Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Something went wrong"

        });

    }

}


async function getMockInterview(req, res) {

    try {

        const { mockInterviewId } = req.params;

        const mockInterview =
            await mockInterviewModel.findOne({
                _id: mockInterviewId,
                user: req.user.id
            });


        if (!mockInterview) {

            return res.status(404).json({
                success: false,
                message: "Mock interview not found"
            });

        }


        return res.status(200).json({

            success: true,

            mockInterview: {

                _id: mockInterview._id,

                questions:
                    mockInterview.questions,

                answers:
                    mockInterview.answers,

                currentQuestionIndex:
                    mockInterview.currentQuestionIndex,

                overallScore:
                    mockInterview.overallScore,

                summary:
                    mockInterview.summary,

                weakAreas:
                    mockInterview.weakAreas,

                status:
                    mockInterview.status,

                totalQuestions:
                    mockInterview.questions.length

            }

        });

    } catch (error) {

        console.error(
            "❌ Get Mock Interview Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Something went wrong"
        });

    }

}


async function submitMockAnswer(req, res) {

    try {

        const { mockInterviewId } = req.params;

        const { answer } = req.body;


        if (!answer || !answer.trim()) {

            return res.status(400).json({
                success: false,
                message: "Answer is required"
            });

        }


        const mockInterview =
            await mockInterviewModel.findOne({
                _id: mockInterviewId,
                user: req.user.id
            });


        if (!mockInterview) {

            return res.status(404).json({
                success: false,
                message: "Mock interview not found"
            });

        }


        if (mockInterview.status === "completed") {

            return res.status(400).json({
                success: false,
                message: "Mock interview is already completed"
            });

        }


        const currentIndex =
            mockInterview.currentQuestionIndex;


        const currentQuestion =
            mockInterview.questions[currentIndex];


        // Get original interview report

        const interviewReport =
            await interviewReportModel.findOne({
                _id: mockInterview.interviewReport,
                user: req.user.id
            });


        if (!interviewReport) {

            return res.status(404).json({
                success: false,
                message: "Interview report not found"
            });

        }


        // AI evaluates the candidate's answer

        const evaluation =
            await evaluateMockInterviewAnswer({

                jobDescription:
                    interviewReport.jobDescription,

                resume:
                    interviewReport.resume,

                question:
                    currentQuestion,

                answer:
                    answer.trim()

            });


        // Save question + answer + AI evaluation

        mockInterview.answers.push({

            question:
                currentQuestion,

            answer:
                answer.trim(),

            score:
                evaluation.score,

            feedback:
                evaluation.feedback,

            strengths:
                evaluation.strengths,

            improvements:
                evaluation.improvements

        });


        mockInterview.currentQuestionIndex =
            currentIndex;


        await mockInterview.save();


        return res.status(200).json({

            success: true,

            message:
                "Answer evaluated successfully",

            evaluation: {

                score:
                    evaluation.score,

                feedback:
                    evaluation.feedback,

                strengths:
                    evaluation.strengths,

                improvements:
                    evaluation.improvements

            },

            mockInterview: {

                _id:
                    mockInterview._id,

                currentQuestionIndex:
                    mockInterview.currentQuestionIndex,

                totalQuestions:
                    mockInterview.questions.length,

                status:
                    mockInterview.status,

                currentQuestion:
                    currentQuestion,

                overallScore:
                    mockInterview.overallScore || null

            }

        });

    } catch (error) {

        console.error(
            "❌ Submit Mock Answer Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Something went wrong"

        });

    }

}


async function nextMockQuestion(req, res) {

    try {

        const { mockInterviewId } =
            req.params;


        const mockInterview =
            await mockInterviewModel.findOne({

                _id:
                    mockInterviewId,

                user:
                    req.user.id

            });


        if (!mockInterview) {

            return res.status(404).json({

                success: false,

                message:
                    "Mock interview not found"

            });

        }


        if (mockInterview.status === "completed") {

            return res.status(400).json({

                success: false,

                message:
                    "Mock interview is already completed"

            });

        }


        const currentIndex =
            mockInterview.currentQuestionIndex;


        const nextIndex =
            currentIndex + 1;


        // =========================================
        // LAST QUESTION FINISHED
        // =========================================

        if (
            nextIndex >=
            mockInterview.questions.length
        ) {

            mockInterview.currentQuestionIndex =
                mockInterview.questions.length;


            mockInterview.status =
                "completed";


            // Calculate overall score

            const totalScore =
                mockInterview.answers.reduce(

                    (sum, item) =>
                        sum + (item.score || 0),

                    0

                );


            mockInterview.overallScore =
                Number(

                    (
                        totalScore /
                        mockInterview.answers.length

                    ).toFixed(1)

                );


            // Get original interview report

            const interviewReport =
                await interviewReportModel.findOne({

                    _id:
                        mockInterview.interviewReport,

                    user:
                        req.user.id

                });


            if (!interviewReport) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Interview report not found"

                });

            }


            // =========================================
            // GENERATE OVERALL AI SUMMARY
            // =========================================

            const summary =
                await generateMockInterviewSummary({

                    jobDescription:
                        interviewReport.jobDescription || "",

                    resume:
                        interviewReport.resume || "",

                    questions:
                        mockInterview.questions,

                    answers:
                        mockInterview.answers

                });


            mockInterview.summary =
                summary;


            // =========================================
            // IDENTIFY WEAK AREAS
            // =========================================

            const weakAreaResult =
                await identifyWeakAreas({

                    jobDescription:
                        interviewReport.jobDescription || "",

                    questions:
                        mockInterview.questions,

                    answers:
                        mockInterview.answers

                });


            mockInterview.weakAreas =
                weakAreaResult.weakAreas;


            // Save everything

            await mockInterview.save();


            return res.status(200).json({

                success: true,

                message:
                    "Mock interview completed",

                mockInterview: {

                    _id:
                        mockInterview._id,

                    questions:
                        mockInterview.questions,

                    answers:
                        mockInterview.answers,

                    currentQuestionIndex:
                        mockInterview.currentQuestionIndex,

                    totalQuestions:
                        mockInterview.questions.length,

                    status:
                        mockInterview.status,

                    currentQuestion:
                        null,

                    overallScore:
                        mockInterview.overallScore,

                    summary:
                        mockInterview.summary,

                    weakAreas:
                        mockInterview.weakAreas

                }

            });

        }


        // =========================================
        // MOVE TO NEXT QUESTION
        // =========================================

        mockInterview.currentQuestionIndex =
            nextIndex;


        await mockInterview.save();


        return res.status(200).json({

            success: true,

            message:
                "Moved to next question",

            mockInterview: {

                _id:
                    mockInterview._id,

                questions:
                    mockInterview.questions,

                answers:
                    mockInterview.answers,

                currentQuestionIndex:
                    mockInterview.currentQuestionIndex,

                totalQuestions:
                    mockInterview.questions.length,

                status:
                    mockInterview.status,

                currentQuestion:
                    mockInterview.questions[nextIndex],

                overallScore:
                    mockInterview.overallScore || null,

                summary:
                    mockInterview.summary,

                weakAreas:
                    mockInterview.weakAreas

            }

        });

    } catch (error) {

        console.error(
            "❌ Next Mock Question Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Something went wrong"

        });

    }

}


module.exports = {

    startMockInterview,

    getMockInterview,

    submitMockAnswer,

    nextMockQuestion

};