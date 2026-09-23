import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, startMockInterview, getMockInterview, submitMockAnswer, nextMockQuestion, startWeakPractice, getWeakPractice,
    submitWeakPracticeAnswer,
    nextWeakPracticeQuestion } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {

        

        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
            
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])


    const startMock = async (interviewReportId) => {
    setLoading(true)

    try {
        const response = await startMockInterview(interviewReportId)

        return response.mockInterview
    } catch (error) {
        console.log("❌ Start Mock Interview Error:", error)
        alert(
            error.response?.data?.message ||
            "Failed to start mock interview"
        )
        return null
    } finally {
        setLoading(false)
    }
}


const fetchMockInterview = async (mockInterviewId) => {
    setLoading(true)

    try {
        const response = await getMockInterview(mockInterviewId)

        return response.mockInterview
    } catch (error) {
        console.log("❌ Get Mock Interview Error:", error)

        alert(
            error.response?.data?.message ||
            "Failed to load mock interview"
        )

        return null
    } finally {
        setLoading(false)
    }
}

const submitMockAnswerForInterview = async (
    mockInterviewId,
    answer
) => {

    setLoading(true)

    try {

        const response = await submitMockAnswer(
            mockInterviewId,
            answer
        )

        return response

    } catch (error) {

        console.log(
            "❌ Submit Mock Answer Error:",
            error
        )

        alert(
            error.response?.data?.message ||
            "Failed to submit answer"
        )

        return null

    } finally {
        setLoading(false)
    }
}


const goToNextMockQuestion = async (mockInterviewId) => {
    setLoading(true)

    try {
        const response =
            await nextMockQuestion(mockInterviewId)

        return response.mockInterview

    } catch (error) {

        console.log(
            "❌ Next Mock Question Error:",
            error
        )

        alert(
            error.response?.data?.message ||
            "Failed to load next question"
        )

        return null

    } finally {
        setLoading(false)
    }
}


const startWeakPracticeSession = async (mockInterviewId) => {

    setLoading(true)

    try {

        const response =
            await startWeakPractice(mockInterviewId)

        return response.weakPractice

    } catch (error) {

        console.log(
            "❌ Start Weak Practice Error:",
            error
        )

        alert(
            error.response?.data?.message ||
            "Failed to start weak area practice"
        )

        return null

    } finally {
        setLoading(false)
    }
}


const fetchWeakPractice = async (weakPracticeId) => {

    setLoading(true)

    try {

        const response =
            await getWeakPractice(weakPracticeId)

        return response.weakPractice

    } catch (error) {

        console.log(
            "❌ Get Weak Practice Error:",
            error
        )

        alert(
            error.response?.data?.message ||
            "Failed to load weak area practice"
        )

        return null

    } finally {
        setLoading(false)
    }
}


const submitWeakPracticeAnswerForInterview = async (
    weakPracticeId,
    answer
) => {

    setLoading(true)

    try {

        const response =
            await submitWeakPracticeAnswer(
                weakPracticeId,
                answer
            )

        return response

    } catch (error) {

        console.log(
            "❌ Submit Weak Practice Answer Error:",
            error
        )

        alert(
            error.response?.data?.message ||
            "Failed to submit practice answer"
        )

        return null

    } finally {
        setLoading(false)
    }
}


const goToNextWeakPracticeQuestion = async (
    weakPracticeId
) => {

    setLoading(true)

    try {

        const response =
            await nextWeakPracticeQuestion(
                weakPracticeId
            )

        return response.weakPractice

    } catch (error) {

        console.log(
            "❌ Next Weak Practice Question Error:",
            error
        )

        alert(
            error.response?.data?.message ||
            "Failed to load next practice question"
        )

        return null

    } finally {
        setLoading(false)
    }
}

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf, startMock, fetchMockInterview, submitMockAnswerForInterview , goToNextMockQuestion, startWeakPracticeSession, fetchWeakPractice,
    submitWeakPracticeAnswer:
        submitWeakPracticeAnswerForInterview,
    goToNextWeakPracticeQuestion}
}