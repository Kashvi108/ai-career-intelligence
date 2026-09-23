const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GROQ_API_KEY
})

// ============================================
// SCHEMAS
// ============================================
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer to ask this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer to ask this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(['low', 'medium', 'high']).describe("The severity of this skill gap")
    })).describe("List of skill gaps in the candidate's profile along with their severity "),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation list starting from day 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan"),
        tasks: z.array(z.string()).describe("List of task to be done on this day to follow the preparation plan")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
})

// ============================================
// GENERATE PDF FROM HTML
// ============================================
async function generatePdfFromHtml(htmlContent) {
    console.log("📄 Launching Puppeteer for PDF generation...")
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        },
        printBackground: true
    })

    await browser.close()
    console.log("📄 PDF generated successfully, size:", pdfBuffer.length)
    return pdfBuffer
}

// ============================================
// GENERATE INTERVIEW REPORT - REAL AI
// ============================================
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        console.log("🤖 AI Service: Generating interview report via Gemini")
        console.log("🤖 Job Description length:", jobDescription?.length || 0)
        console.log("🤖 Resume length:", resume?.length || 0)
        console.log("🤖 Self Description length:", selfDescription?.length || 0)
        
        // ✅ Check if API key exists
        if (!process.env.GOOGLE_GENAI_API_KEY) {
            throw new Error("GOOGLE_GENAI_API_KEY is not set in environment variables")
        }

        const prompt = `Generate an interview report for a candidate with the following details:
        
        Resume: ${resume}
        
        Self Description: ${selfDescription}
        
        Job Description: ${jobDescription}
        
        Please generate a comprehensive interview report with:
        1. Match score (0-100)
        2. 5-8 technical questions with intention and model answers
        3. 3-5 behavioral questions with intention and model answers
        4. 3-5 skill gaps with severity (low/medium/high)
        5. A 5-day preparation plan with daily focus and tasks
        
        Make the response detailed, specific, and tailored to the candidate's profile and the job requirements.
        `
        
        console.log("🤖 Sending request to Gemini API...")
        
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema)
            }
        })

        console.log("🤖 Gemini API response received")
        const result = JSON.parse(response.text)
        console.log("🤖 Result keys:", Object.keys(result))
        console.log("🤖 Match Score:", result.matchScore)
        console.log("🤖 Technical Questions:", result.technicalQuestions?.length || 0)
        console.log("🤖 Behavioral Questions:", result.behavioralQuestions?.length || 0)
        console.log("🤖 Skill Gaps:", result.skillGaps?.length || 0)
        console.log("🤖 Preparation Plan Days:", result.preparationPlan?.length || 0)
        
        return result

    } catch (error) {
        console.log("❌ AI Service Error:", error.message)
        if (error.status === 429) {
            console.log("⚠️ QUOTA EXCEEDED! Options:")
            console.log("1. Wait 5-10 minutes")
            console.log("2. Create a new API key at https://aistudio.google.com/")
            console.log("3. Use a different model: gemini-1.5-flash")
        }
        throw error
    }
}

// ============================================
// GENERATE RESUME PDF - REAL AI
// ============================================
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    try {
        console.log("📄 Generating Resume PDF via Gemini")
        console.log("📄 Resume length:", resume?.length || 0)
        console.log("📄 Job Description length:", jobDescription?.length || 0)
        
        if (!process.env.GOOGLE_GENAI_API_KEY) {
            throw new Error("GOOGLE_GENAI_API_KEY is not set in environment variables")
        }

        const prompt = `Generate a professional, ATS-friendly resume HTML for a candidate with the following details:

        Original Resume Content: ${resume}
        
        Self Description: ${selfDescription}
        
        Target Job Description: ${jobDescription}

        The resume should:
        1. Be tailored specifically for the target job description
        2. Highlight relevant skills and experience that match the job requirements
        3. Use a clean, professional, and modern design
        4. Be ATS-friendly (machine-readable, proper headings, simple formatting)
        5. Include sections: Professional Summary, Skills, Experience, Education
        6. The HTML should be well-formatted and visually appealing
        7. Use appropriate colors (professional blues, clean whites)
        8. The content should sound human-written, not AI-generated
        
        Return ONLY valid HTML inside the html field.`
        
        console.log("📄 Sending resume generation request to Gemini...")
        
        const response = await ai.models.generateContent({
            model: "gemini-1.0-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(resumePdfSchema),
            }
        })

        const jsonContent = JSON.parse(response.text)
        console.log("📄 HTML content length:", jsonContent.html?.length || 0)

        const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
        console.log("📄 PDF generated, size:", pdfBuffer.length)
        return pdfBuffer

    } catch (error) {
        console.log("❌ Resume PDF Generation Error:", error.message)
        if (error.status === 429) {
            console.log("⚠️ QUOTA EXCEEDED! Please wait or get a new API key.")
        }
        throw error
    }
}

module.exports = { generateInterviewReport, generateResumePdf }