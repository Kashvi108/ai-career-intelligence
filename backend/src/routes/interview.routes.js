const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controller/interview.controller")
const upload = require("../middlewares/file.middleware")
const mockInterviewController = require("../controller/mockInterview.controller");
const weakPracticeController = require("../controller/weakPractice.controller");

const interviewRouter = express.Router()




interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

interviewRouter.post(
    "/mock/start",
    authMiddleware.authUser,
    mockInterviewController.startMockInterview
);

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)


interviewRouter.get(
    "/mock/:mockInterviewId",
    authMiddleware.authUser,
    mockInterviewController.getMockInterview
)

interviewRouter.post(
    "/mock/:mockInterviewId/answer",
    authMiddleware.authUser,
    mockInterviewController.submitMockAnswer
)

interviewRouter.post(
    "/mock/:mockInterviewId/next",
    authMiddleware.authUser,
    mockInterviewController.nextMockQuestion
)

interviewRouter.post(

    "/weak-practice/start",

    authMiddleware.authUser,

    weakPracticeController.startWeakPractice

)


interviewRouter.get(
    "/weak-practice/:weakPracticeId",
    authMiddleware.authUser,
    weakPracticeController.getWeakPractice
);

interviewRouter.post(
    "/weak-practice/:weakPracticeId/answer",
    authMiddleware.authUser,
    weakPracticeController.submitWeakPracticeAnswer
);

interviewRouter.post(
    "/weak-practice/:weakPracticeId/next",
    authMiddleware.authUser,
    weakPracticeController.nextWeakPracticeQuestion
);


module.exports = interviewRouter