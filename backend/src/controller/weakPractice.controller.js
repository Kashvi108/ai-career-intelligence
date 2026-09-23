const weakPracticeModel =
    require("../models/weakPractice.model");

const mockInterviewModel =
    require("../models/mockInterview.model");

const interviewReportModel =
    require("../models/interviewReport.model");

const {
    generateWeakPracticeQuestions, evaluateMockInterviewAnswer
} = require("../services/groq.service");


async function startWeakPractice(req, res) {

    try {

        const { mockInterviewId } = req.body;

        if (!mockInterviewId) {
            return res.status(400).json({
                success: false,
                message: "Mock interview ID is required"
            });
        }


        // Find completed mock interview
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


        if (mockInterview.status !== "completed") {
            return res.status(400).json({
                success: false,
                message:
                    "Complete the mock interview before practicing weak areas"
            });
        }


        if (
            !mockInterview.weakAreas ||
            mockInterview.weakAreas.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "No weak areas were identified for this interview"
            });
        }


        // Find original interview report
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


        // Generate targeted questions
        const questions =
            await generateWeakPracticeQuestions({

                jobDescription:
                    interviewReport.jobDescription || "",

                weakAreas:
                    mockInterview.weakAreas,

                previousAnswers:
                    mockInterview.answers || []

            });


        if (!questions || questions.length === 0) {
            return res.status(500).json({
                success: false,
                message:
                    "Failed to generate weak area practice questions"
            });
        }


        // Create weak practice session
        const weakPractice =
            await weakPracticeModel.create({

                user:
                    req.user.id,

                mockInterview:
                    mockInterview._id,

                weakAreas:
                    mockInterview.weakAreas,

                questions,

                answers: [],

                currentQuestionIndex: 0,

                status: "in-progress"

            });


        return res.status(201).json({

            success: true,

            message:
                "Weak area practice started successfully",

            weakPractice: {

                _id:
                    weakPractice._id,

                weakAreas:
                    weakPractice.weakAreas,

                questions:
                    weakPractice.questions,

                currentQuestionIndex:
                    weakPractice.currentQuestionIndex,

                totalQuestions:
                    weakPractice.questions.length,

                currentQuestion:
                    weakPractice.questions[0],

                status:
                    weakPractice.status

            }

        });

    } catch (error) {

        console.error(
            "❌ Start Weak Practice Error:",
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


async function getWeakPractice(req, res) {

    try {

        const { weakPracticeId } = req.params;

        const weakPractice =
            await weakPracticeModel.findOne({
                _id: weakPracticeId,
                user: req.user.id
            });

        if (!weakPractice) {
            return res.status(404).json({
                success: false,
                message: "Weak practice session not found"
            });
        }

        const currentIndex =
            weakPractice.currentQuestionIndex || 0;

        return res.status(200).json({
            success: true,
            weakPractice: {
                _id: weakPractice._id,
                weakAreas: weakPractice.weakAreas,
                questions: weakPractice.questions,
                answers: weakPractice.answers,
                currentQuestionIndex:
                    weakPractice.currentQuestionIndex,
                currentQuestion:
                    weakPractice.questions[currentIndex] || null,
                totalQuestions:
                    weakPractice.questions.length,
                overallScore:
                    weakPractice.overallScore,
                status:
                    weakPractice.status
            }
        });

    } catch (error) {

        console.error(
            "❌ Get Weak Practice Error:",
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


async function submitWeakPracticeAnswer(req, res) {

    try {

        const { weakPracticeId } = req.params;
        const { answer } = req.body;

        if (!answer || !answer.trim()) {
            return res.status(400).json({
                success: false,
                message: "Answer is required"
            });
        }

        const weakPractice =
            await weakPracticeModel.findOne({
                _id: weakPracticeId,
                user: req.user.id
            });

        if (!weakPractice) {
            return res.status(404).json({
                success: false,
                message: "Weak practice session not found"
            });
        }

        if (weakPractice.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "This practice session is already completed"
            });
        }

        const currentIndex =
            weakPractice.currentQuestionIndex || 0;

        const currentQuestion =
            weakPractice.questions[currentIndex];

        if (!currentQuestion) {
            return res.status(400).json({
                success: false,
                message: "Current question not found"
            });
        }

        const mockInterview =
            await mockInterviewModel.findOne({
                _id: weakPractice.mockInterview,
                user: req.user.id
            });

        if (!mockInterview) {
            return res.status(404).json({
                success: false,
                message: "Original mock interview not found"
            });
        }

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

        const evaluation =
            await evaluateMockInterviewAnswer({
                jobDescription:
                    interviewReport.jobDescription || "",

                resume:
                    interviewReport.resume || "",

                question:
                    currentQuestion,

                answer:
                    answer.trim()
            });

        weakPractice.answers.push({
            question: currentQuestion,
            answer: answer.trim(),
            score: evaluation.score,
            feedback: evaluation.feedback,
            strengths: evaluation.strengths,
            improvements: evaluation.improvements
        });

        await weakPractice.save();

        return res.status(200).json({
            success: true,
            evaluation,
            weakPractice: {
                _id: weakPractice._id,
                weakAreas: weakPractice.weakAreas,
                questions: weakPractice.questions,
                answers: weakPractice.answers,
                currentQuestionIndex:
                    weakPractice.currentQuestionIndex,
                currentQuestion,
                totalQuestions:
                    weakPractice.questions.length,
                overallScore:
                    weakPractice.overallScore,
                status:
                    weakPractice.status
            }
        });

    } catch (error) {

        console.error(
            "❌ Submit Weak Practice Answer Error:",
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

async function nextWeakPracticeQuestion(req, res) {

    try {

        const { weakPracticeId } = req.params;

        const weakPractice =
            await weakPracticeModel.findOne({
                _id: weakPracticeId,
                user: req.user.id
            });

        if (!weakPractice) {
            return res.status(404).json({
                success: false,
                message: "Weak practice session not found"
            });
        }

        if (weakPractice.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "This practice session is already completed"
            });
        }

        const nextIndex =
            (weakPractice.currentQuestionIndex || 0) + 1;

        // Practice finished
        if (nextIndex >= weakPractice.questions.length) {

            weakPractice.currentQuestionIndex =
                weakPractice.questions.length;

            weakPractice.status = "completed";

            const scores =
                weakPractice.answers
                    .map(item => item.score)
                    .filter(score => typeof score === "number");

            if (scores.length > 0) {

                const total =
                    scores.reduce(
                        (sum, score) => sum + score,
                        0
                    );

                weakPractice.overallScore =
                    Number((total / scores.length).toFixed(1));
            } else {
                weakPractice.overallScore = 0;
            }

            await weakPractice.save();

            return res.status(200).json({
                success: true,
                message: "Weak area practice completed",
                weakPractice: {
                    _id: weakPractice._id,
                    weakAreas: weakPractice.weakAreas,
                    questions: weakPractice.questions,
                    answers: weakPractice.answers,
                    currentQuestionIndex:
                        weakPractice.currentQuestionIndex,
                    currentQuestion: null,
                    totalQuestions:
                        weakPractice.questions.length,
                    overallScore:
                        weakPractice.overallScore,
                    status:
                        weakPractice.status
                }
            });
        }

        // Move to next question
        weakPractice.currentQuestionIndex =
            nextIndex;

        await weakPractice.save();

        return res.status(200).json({
            success: true,
            weakPractice: {
                _id: weakPractice._id,
                weakAreas: weakPractice.weakAreas,
                questions: weakPractice.questions,
                answers: weakPractice.answers,
                currentQuestionIndex:
                    weakPractice.currentQuestionIndex,
                currentQuestion:
                    weakPractice.questions[nextIndex],
                totalQuestions:
                    weakPractice.questions.length,
                overallScore:
                    weakPractice.overallScore,
                status:
                    weakPractice.status
            }
        });

    } catch (error) {

        console.error(
            "❌ Next Weak Practice Question Error:",
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
    startWeakPractice, getWeakPractice, submitWeakPracticeAnswer, nextWeakPracticeQuestion
};