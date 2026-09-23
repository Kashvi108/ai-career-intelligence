const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },

        answer: {
            type: String,
            required: true
        },

        score: {
            type: Number,
            min: 0,
            max: 10
        },

        feedback: {
            type: String
        },

        strengths: [
            {
                type: String
            }
        ],

        improvements: [
            {
                type: String
            }
        ]
    },
    {
        _id: false
    }
);


const mockInterviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        interviewReport: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewReport",
            required: true
        },

        questions: [
            {
                type: String
            }
        ],

        answers: [
            answerSchema
        ],

        currentQuestionIndex: {
            type: Number,
            default: 0
        },

        overallScore: {
            type: Number,
            min: 0,
            max: 10
        },

        summary: {
            type: String,
            default: ""
        },

        weakAreas: [
    {
        type: String
    }
],

        status: {
            type: String,
            enum: ["in-progress", "completed"],
            default: "in-progress"
        }
    },
    {
        timestamps: true
    }
);


const mockInterviewModel = mongoose.model(
    "MockInterview",
    mockInterviewSchema
);

module.exports = mockInterviewModel;