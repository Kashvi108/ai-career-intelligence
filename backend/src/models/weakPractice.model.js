const mongoose = require("mongoose");

const weakPracticeAnswerSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },

        answer: {
            type: String,
            default: ""
        },

        score: {
            type: Number,
            min: 0,
            max: 10
        },

        feedback: {
            type: String,
            default: ""
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

const weakPracticeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        mockInterview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MockInterview",
            required: true
        },

        weakAreas: [
            {
                type: String
            }
        ],

        questions: [
            {
                type: String
            }
        ],

        answers: [
            weakPracticeAnswerSchema
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

const weakPracticeModel = mongoose.model(
    "WeakPractice",
    weakPracticeSchema
);

module.exports = weakPracticeModel;