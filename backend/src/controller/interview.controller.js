const pdfParse = require("pdf-parse")
const mammoth = require("mammoth")
const { generateInterviewReportGroq, generateResumePdfGroq } = require("../services/groq.service")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")


const USE_GROQ = true;  // Change to false to use Gemini

async function generateInterViewReportController(req, res) {
    try {
        console.log("1. Controller: Generating interview report")
        console.log("2. File received:", req.file ? req.file.originalname : "No file")
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required"
            })
        }
        
       // ✅ Parse Resume based on file type
console.log("3. Parsing Resume...")

let resumeText = ""
const fileName = req.file.originalname.toLowerCase()

if (fileName.endsWith(".pdf")) {
    console.log("📄 Detected PDF file")

    const resumeContent = await pdfParse(req.file.buffer)
    resumeText = resumeContent.text

} else if (fileName.endsWith(".docx")) {
    console.log("📄 Detected DOCX file")

    const resumeContent = await mammoth.extractRawText({
        buffer: req.file.buffer
    })

    resumeText = resumeContent.value

} else {
    return res.status(400).json({
        success: false,
        message: "Only PDF and DOCX resume files are supported."
    })
}

console.log("4. Resume parsed. Length:", resumeText.length)
        
        const { selfDescription, jobDescription } = req.body
        console.log("5. Job Description:", jobDescription)
        console.log("6. Self Description:", selfDescription)

        // ✅ Generate report using Groq or Gemini
        console.log(`7. Using ${USE_GROQ ? 'Groq' : 'Gemini'} API...`)
        let interViewReportByAi;
        
        if (USE_GROQ) {
            interViewReportByAi = await generateInterviewReportGroq({
                resume: resumeText,
                selfDescription,
                jobDescription
            });
        } else {
            interViewReportByAi = await generateInterviewReport({
                resume: resumeText,
                selfDescription,
                jobDescription
            });
        }
        
        console.log("8. AI Response received")
        console.log("9. AI Response keys:", Object.keys(interViewReportByAi || {}))

        // ✅ Ensure all fields exist with fallback values
        const reportData = {
            user: req.user.id,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription || "",
            matchScore: interViewReportByAi?.matchScore || 0,
            matchBreakdown: interViewReportByAi?.matchBreakdown || null,
            technicalQuestions: interViewReportByAi?.technicalQuestions || [],
            behavioralQuestions: interViewReportByAi?.behavioralQuestions || [],
            skillGaps: interViewReportByAi?.skillGaps || [],
            preparationPlan: interViewReportByAi?.preparationPlan || [],
            title: interViewReportByAi?.title || "Untitled Position"
        }

        console.log("10. Creating report with data:", {
            user: reportData.user,
            title: reportData.title,
            matchScore: reportData.matchScore,
            technicalQuestionsCount: reportData.technicalQuestions.length,
            behavioralQuestionsCount: reportData.behavioralQuestions.length,
            skillGapsCount: reportData.skillGaps.length,
            preparationPlanCount: reportData.preparationPlan.length
        })

        const interviewReport = await interviewReportModel.create(reportData)
        console.log("11. Report saved with ID:", interviewReport._id)

        res.status(201).json({
            success: true,
            message: "Interview report generated successfully.",
            interviewReport
        })

    } catch (error) {
        console.log("❌ Error:", error.message)
        console.log("❌ Error stack:", error.stack)
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        })
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params
        console.log("📄 Getting report for ID:", interviewId)

        const interviewReport = await interviewReportModel.findOne({ 
            _id: interviewId, 
            user: req.user.id 
        })

        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found."
            })
        }

        console.log("📄 Report found:", interviewReport._id)

        res.status(200).json({
            success: true,
            message: "Interview report fetched successfully.",
            interviewReport
        })

    } catch (error) {
        console.log("❌ Error:", error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

/**
 * @description Controller to get all interview reports
 */
async function getAllInterviewReportsController(req, res) {
    try {
        console.log("📄 Getting all reports for user:", req.user.id)

        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        console.log("📄 Found", interviewReports.length, "reports")

        res.status(200).json({
            success: true,
            message: "Interview reports fetched successfully.",
            interviewReports
        })

    } catch (error) {
        console.log("❌ Error:", error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params
        console.log("📄 Generating PDF for report:", interviewReportId)

        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        console.log("📄 Generating PDF...")
        let pdfBuffer;
        
        if (USE_GROQ) {
            const html = await generateResumePdfGroq({ 
                resume: resume || "", 
                jobDescription: jobDescription || "", 
                selfDescription: selfDescription || "" 
            });
            // ✅ Convert HTML to PDF
            const puppeteer = require('puppeteer');
            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: "networkidle0" });
            pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
            await browser.close();
        } else {
            pdfBuffer = await generateResumePdf({ 
                resume: resume || "", 
                jobDescription: jobDescription || "", 
                selfDescription: selfDescription || "" 
            });
        }

        console.log("📄 PDF generated, size:", pdfBuffer.length)

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)

    } catch (error) {
        console.log("❌ Error in generateResumePdfController:", error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController 
}