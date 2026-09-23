const mongoose = require ('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true, "Technical question is required"]
    },
    intention:{
        type:String,
        required:[true, "Intention is required"]
    },
    answer:{
        type:String,
        required:[true, "Answer is required"]
    }
},{
    _id: false
})


const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true, "Technical question is required"]
    },
    intention:{
        type:String,
        required:[true, "Intention is required"]
    },
    answer:{
        type:String,
        required:[true, "Answer is required"]
    }
},{
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true, "Skill is required"]
    },
    severity:{
        type: String,
        enum:["low", "medium","high"],
        required:[true, "Severity is required"]
    }
}, {
    _id:false
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,"Focus is required"]
    },
    tasks:[{
        type: String,
        required:[true, "Task is required"]
    }]
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type: String,
        required: [true, "Job description is required"]
    },
     resume:{
        type: String,
     },
     selfDescription:{
        type: String,
     },
    matchScore:{
    type: Number,
    min: 0,
    max: 100
},

matchBreakdown: {
    overallMatchScore: {
        type: Number,
        min: 0,
        max: 100
    },

    skillsMatch: {
        type: Number,
        min: 0,
        max: 100
    },

    experienceMatch: {
        type: Number,
        min: 0,
        max: 100
    },

    roleAlignment: {
        type: Number,
        min: 0,
        max: 100
    },

    matchingEvidence: [{
        requirement: {
            type: String,
            trim: true
        },
        resumeEvidence: {
            type: String,
            trim: true
        },
        supportLevel: {
            type: String,
            enum: ["explicit", "partial", "missing"]
        }
    }],

    missingWeakAreas: [{
        requirement: {
            type: String,
            trim: true
        },
        reason: {
            type: String,
            trim: true
        },
        supportLevel: {
            type: String,
            enum: ["partial", "missing"]
        }
    }],

    whyNotHigher: {
        type: String,
        trim: true
    },

    importantJdRequirements: [{
        requirement: {
            type: String,
            trim: true
        },
        reason: {
            type: String,
            trim: true
        }
    }],

    relevantStrengths: [{
        strength: {
            type: String,
            trim: true
        },
        resumeEvidence: {
            type: String,
            trim: true
        }
    }],

    actionableSuggestions: [{
        suggestion: {
            type: String,
            trim: true
        },
        relatedRequirement: {
            type: String,
            trim: true
        }
    }]
},

technicalQuestions: [technicalQuestionSchema],
     technicalQuestions: [technicalQuestionSchema],
     behavioralQuestions: [behavioralQuestionSchema],
     skillGaps: [skillGapSchema],
     preparationPlan: [preparationPlanSchema],
     user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
     },
     title:{
        type: String,
        // required: [true, "Job title is required"]
        default: "Untitled Position"
     }
},{
    timestamps: true
})

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;