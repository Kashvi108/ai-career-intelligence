import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})


export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    console.log("📄 11. API called")
    console.log("📄 12. File in API:", resumeFile)

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data
}


export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}

export const startMockInterview = async (interviewReportId) => {
    const response = await api.post("/api/interview/mock/start", {
        interviewReportId
    })

    return response.data
}

export const getMockInterview = async (mockInterviewId) => {
    const response = await api.get(
        `/api/interview/mock/${mockInterviewId}`
    )

    return response.data
}

export const submitMockAnswer = async (
    mockInterviewId,
    answer
) => {

    const response = await api.post(
        `/api/interview/mock/${mockInterviewId}/answer`,
        {
            answer
        }
    )

    return response.data
}

  export const nextMockQuestion = async (mockInterviewId) => {
    const response = await api.post(
        `/api/interview/mock/${mockInterviewId}/next`
    )
return response.data
}

export const startWeakPractice = async (mockInterviewId) => {

    const response = await api.post(
        "/api/interview/weak-practice/start",
        {
            mockInterviewId
        }
    )

    return response.data
}


export const getWeakPractice = async (weakPracticeId) => {

    const response = await api.get(
        `/api/interview/weak-practice/${weakPracticeId}`
    )

    return response.data
}


export const submitWeakPracticeAnswer = async (
    weakPracticeId,
    answer
) => {

    const response = await api.post(
        `/api/interview/weak-practice/${weakPracticeId}/answer`,
        {
            answer
        }
    )

    return response.data
}


export const nextWeakPracticeQuestion = async (
    weakPracticeId
) => {

    const response = await api.post(
        `/api/interview/weak-practice/${weakPracticeId}/next`
    )

    return response.data
}