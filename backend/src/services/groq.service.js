const Groq = require("groq-sdk");


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


function cleanText(value) {
    if (!value) return "";

    return String(value)
        .replace(/\u0000/g, "")
        .trim();
}

function limitText(value, maxLength = 18000) {
    const text = cleanText(value);

    if (text.length <= maxLength) {
        return text;
    }

    return text.slice(0, maxLength) + "\n[Content truncated]";
}

function validateInterviewReport(result) {
    if (!result || typeof result !== "object") {
        throw new Error("AI returned an invalid report");
    }

    if (typeof result.matchScore !== "number") {
        throw new Error("AI report is missing matchScore");
    }

    if (
    !result.matchBreakdown ||
    typeof result.matchBreakdown !== "object"
) {
    throw new Error("AI report is missing matchBreakdown");
}

if (
    typeof result.matchBreakdown.overallMatchScore !== "number"
) {
    throw new Error(
        "AI report is missing overallMatchScore"
    );
}

if (
    typeof result.matchBreakdown.skillsMatch !== "number"
) {
    throw new Error(
        "AI report is missing skillsMatch"
    );
}

if (
    typeof result.matchBreakdown.experienceMatch !== "number"
) {
    throw new Error(
        "AI report is missing experienceMatch"
    );
}

if (
    typeof result.matchBreakdown.roleAlignment !== "number"
) {
    throw new Error(
        "AI report is missing roleAlignment"
    );
}

if (
    !Array.isArray(result.matchBreakdown.matchingEvidence)
) {
    throw new Error(
        "AI report is missing matchingEvidence"
    );
}

if (
    !Array.isArray(result.matchBreakdown.missingWeakAreas)
) {
    throw new Error(
        "AI report is missing missingWeakAreas"
    );
}

if (
    typeof result.matchBreakdown.whyNotHigher !== "string"
) {
    throw new Error(
        "AI report is missing whyNotHigher"
    );
}

if (
    !Array.isArray(result.matchBreakdown.importantJdRequirements)
) {
    throw new Error(
        "AI report is missing importantJdRequirements"
    );
}

if (
    !Array.isArray(result.matchBreakdown.relevantStrengths)
) {
    throw new Error(
        "AI report is missing relevantStrengths"
    );
}

if (
    !Array.isArray(result.matchBreakdown.actionableSuggestions)
) {
    throw new Error(
        "AI report is missing actionableSuggestions"
    );
}

    if (!result.title) {
        throw new Error("AI report is missing title");
    }

    if (!Array.isArray(result.technicalQuestions)) {
        throw new Error("AI report is missing technicalQuestions");
    }

    if (!Array.isArray(result.behavioralQuestions)) {
        throw new Error("AI report is missing behavioralQuestions");
    }

    if (!Array.isArray(result.skillGaps)) {
        throw new Error("AI report is missing skillGaps");
    }

    if (!Array.isArray(result.preparationPlan)) {
        throw new Error("AI report is missing preparationPlan");
    }

    return result;
}


// ────────────────────────────────────────────────────────
// 1. INTERVIEW REPORT GENERATION
// ────────────────────────────────────────────────────────

async function generateInterviewReportGroq({
    resume,
    selfDescription,
    jobDescription
}) {
    try {
        console.log("🤖 Groq: Generating personalized interview report...");

        const safeResume = limitText(resume);
        const safeSelfDescription = limitText(selfDescription, 8000);
        const safeJobDescription = limitText(jobDescription, 12000);

        console.log("📄 Resume length:", safeResume.length);
        console.log("📝 Self description length:", safeSelfDescription.length);
        console.log("💼 Job description length:", safeJobDescription.length);

        const prompt = `
You are an expert interview preparation specialist.

Your job is to analyze THREE pieces of information:

1. The candidate's resume
2. The candidate's self-description
3. The target job description

You MUST generate an interview preparation report that is SPECIFIC to the target role.

==================================================
CANDIDATE RESUME
==================================================

${safeResume || "No resume content provided."}

==================================================
CANDIDATE SELF DESCRIPTION
==================================================

${safeSelfDescription || "No self-description provided."}

==================================================
TARGET JOB DESCRIPTION
==================================================

${safeJobDescription || "No job description provided."}


==================================================
CORE ANALYSIS RULES
==================================================

RULE 1 — IDENTIFY THE TARGET ROLE FIRST

Before generating questions, determine the actual target role from the job description.

The job description is the primary source for determining what role the candidate is preparing for.

Do NOT assume the role is a software engineering role just because the resume contains programming skills.

For example:

If the target job is:
"Junior Marketing Executive"

then questions should focus on marketing responsibilities such as:
- marketing strategy
- content creation
- market research
- customer/client communication
- campaign performance
- MS Excel/data analysis
- sales collaboration
- events/trade shows/conferences

Do NOT generate generic React, JavaScript, Node.js or MongoDB questions simply because those technologies appear in the resume.


RULE 2 — JOB DESCRIPTION MUST DRIVE THE QUESTIONS

Extract the most important responsibilities, skills, tools, knowledge areas and expectations from the job description.

Technical/role-specific questions must primarily test those requirements.

The questions must change when the job description changes.

Do NOT reuse a generic fixed question set across different job roles.


RULE 3 — USE THE RESUME AS CANDIDATE-SPECIFIC CONTEXT

Use the resume to understand:

- previous work experience
- projects
- education
- skills
- tools
- responsibilities
- achievements
- domain experience

Ask questions that connect the candidate's background to the target role.

Example:

If the candidate has frontend development experience but is applying for a marketing role, you may ask how their technical background could support marketing activities such as website analytics, campaign landing pages, digital content or data-driven decision making.

Do not pretend that the candidate has marketing experience if the resume does not state it.


RULE 4 — NEVER INVENT CANDIDATE FACTS

Do NOT invent:

- companies
- job titles
- employment dates
- projects
- certifications
- achievements
- metrics
- clients
- responsibilities
- tools
- experience
- education
- marketing campaigns
- leadership experience

Only use facts supported by the supplied resume or self-description.

If something is missing, do not fabricate it.


RULE 5 — TECHNICAL QUESTIONS

Generate 8-10 questions.

These should be ROLE-SPECIFIC questions.

Use this approximate distribution:

- 50-60% questions based directly on the job description
- 20-30% questions connecting the candidate's resume to the role
- 10-20% practical/scenario-based questions

Avoid generic textbook questions unless that concept is directly relevant to the target job.

Questions should have varying difficulty:

- foundational
- practical
- scenario-based
- role-specific

Every question should make sense for the target job.


RULE 6 — BEHAVIORAL QUESTIONS

Generate 5-7 behavioral questions.

Behavioral questions must be connected to the actual target role.

Do NOT use the same generic behavioral questions for every role.

Questions should relate to responsibilities such as:

- communication
- teamwork
- dealing with clients
- handling deadlines
- solving role-specific problems
- working with stakeholders
- handling mistakes
- adapting to changing requirements

Whenever possible, connect questions to experiences actually present in the candidate's resume.

The model answer should be a useful answer framework based on the candidate's known background.

Do not invent experiences.


RULE 7 — SKILL GAP ANALYSIS

Identify 4-6 meaningful skill gaps.

Compare:

TARGET JOB REQUIREMENTS
versus
CANDIDATE'S DEMONSTRATED SKILLS/EXPERIENCE

Only identify a gap when there is evidence that the job expects something that the candidate has not clearly demonstrated.

Severity:

high:
Important requirement with little/no evidence in the resume.

medium:
Relevant requirement with limited evidence or partial alignment.

low:
Minor gap or area that could improve interview readiness.


RULE 8 — PREPARATION ROADMAP

Create a personalized 5-7 day preparation plan.

The roadmap MUST be based on the identified skill gaps and target job.

Do NOT create the same roadmap for every candidate.

Each day should contain:

- day
- focus
- 2-4 concrete tasks

Prioritize the most important gaps first.

Include practical preparation such as:

- concepts to study
- exercises
- mock interview practice
- role-specific scenarios
- resume-based questions
- company/job research preparation


RULE 9 — DETAILED MATCH ANALYSIS AND MATCH SCORE

Analyze the candidate's resume against the target job description before calculating the match score.

Evaluate:

- required skills
- responsibilities
- experience
- education
- demonstrated tools
- domain knowledge
- role-specific requirements

Calculate these four component scores:

1. skillsMatch
   How strongly the candidate's demonstrated skills match the important skills required by the job.

2. experienceMatch
   How strongly the candidate's actual experience matches the experience and responsibilities required by the job.

3. roleAlignment
   How closely the candidate's overall background, projects, education, experience, and demonstrated capabilities align with the target role.

4. overallMatchScore
   The overall evidence-based match between the candidate and the specific job description.

The scores must be between 0 and 100.

Do not calculate the score based on the number of matching keywords alone.

Prioritize important job requirements over minor requirements.

A skill mentioned in the resume but unrelated to the target role should not significantly increase the match score.

For every important matching requirement, provide resume evidence.

For every important requirement that is not sufficiently supported, explain why.

Clearly distinguish:

- explicitly supported
- partially supported
- missing

The overallMatchScore should be consistent with the component scores and the evidence provided.

Do not invent evidence to justify a higher score.

Do not give a high score simply because the candidate has many skills.

The score should reflect the match between THIS resume and THIS job.


==================================================
IMPORTANT EXAMPLE
==================================================

Suppose:

TARGET ROLE:
Junior Marketing Executive

JOB DESCRIPTION:
- Marketing strategy
- Content creation
- Market research
- Client/vendor relationships
- MS Excel
- Campaign performance
- Sales collaboration
- Events and conferences

RESUME:
- React
- JavaScript
- Node.js
- MongoDB
- Frontend development

Then:

BAD QUESTIONS:

"What is React?"
"What is a JavaScript closure?"
"What is MongoDB?"

unless the job description specifically requires them.

GOOD QUESTIONS:

"How would you approach creating a marketing strategy for a new product aimed at a specific customer segment?"

"How would you use Excel to track and evaluate campaign performance?"

"How would you conduct market research before launching a campaign?"

"How would you handle communication with a vendor who is not meeting campaign requirements?"

"Your resume shows frontend development experience. How could your technical background help you support digital marketing activities?"

The same principle applies to EVERY target role.


==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Use exactly this structure:

{
    "matchScore": 0,

    "matchBreakdown": {
        "overallMatchScore": 0,

        "skillsMatch": 0,

        "experienceMatch": 0,

        "roleAlignment": 0,

        "matchingEvidence": [
            {
                "requirement": "",
                "resumeEvidence": "",
                "supportLevel": "explicit"
            }
        ],

        "missingWeakAreas": [
            {
                "requirement": "",
                "reason": "",
                "supportLevel": "missing"
            }
        ],

        "whyNotHigher": "",

        "importantJdRequirements": [
            {
                "requirement": "",
                "reason": ""
            }
        ],

        "relevantStrengths": [
            {
                "strength": "",
                "resumeEvidence": ""
            }
        ],

        "actionableSuggestions": [
            {
                "suggestion": "",
                "relatedRequirement": ""
            }
        ]
    },

    "title": "Target Job Title",

    "technicalQuestions": [
        {
            "question": "...",
            "intention": "...",
            "answer": "..."
        }
    ],

    "behavioralQuestions": [
        {
            "question": "...",
            "intention": "...",
            "answer": "..."
        }
    ],

    "skillGaps": [
        {
            "skill": "...",
            "severity": "low"
        }
    ],

    "preparationPlan": [
        {
            "day": 1,
            "focus": "...",
            "tasks": [
                "...",
                "...",
                "..."
            ]
        }
    ]
}

Additional requirements:

- matchScore must be between 0 and 100.
- severity must be exactly one of: low, medium, high.
- day must be a number.
- technicalQuestions must contain 8-10 items.
- behavioralQuestions must contain 5-7 items.
- skillGaps must contain 4-6 items.
- preparationPlan must contain 5-7 days.
- tasks must contain 2-4 useful tasks.
- No markdown.
- No comments.
- No text outside the JSON object.

- matchBreakdown.overallMatchScore must be between 0 and 100.
- matchBreakdown.skillsMatch must be between 0 and 100.
- matchBreakdown.experienceMatch must be between 0 and 100.
- matchBreakdown.roleAlignment must be between 0 and 100.

- matchBreakdown must be based ONLY on the supplied resume and job description.

- Do NOT use generic assumptions about the candidate.

- matchingEvidence must contain evidence that is actually supported by the resume.

- supportLevel must be exactly one of:
  "explicit",
  "partial",
  "missing".

- Use "explicit" only when the resume clearly states the skill, experience, qualification, responsibility, or evidence.

- Use "partial" when the resume provides related evidence but does not clearly demonstrate the full job requirement.

- Use "missing" when the job requirement is not supported by the resume.

- missingWeakAreas must contain only requirements that are partially supported or missing from the resume.

- importantJdRequirements must focus on important requirements from the job description that are not sufficiently supported by the resume.

- relevantStrengths must contain only strengths supported by actual resume evidence.

- actionableSuggestions must be practical suggestions for improving fit for the target job.

- Do NOT suggest adding a skill, experience, certification, achievement, or qualification to the resume unless the candidate actually has it.

- Do NOT fabricate experience to improve the match score.

- whyNotHigher must specifically explain the major JD requirements that prevent a higher score.

- The four component scores must be consistent with the evidence provided in matchBreakdown.

- overallMatchScore should reflect the overall evidence-based match between the resume and the job description.

- Do not give a high score merely because the candidate has many unrelated skills.
`;

        console.log("🤖 Sending personalized prompt to Groq...");

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a highly accurate interview preparation specialist. Analyze the supplied resume and job description carefully. Job-specific relevance is more important than generic technical knowledge. Never invent candidate facts. Always return valid JSON matching the requested schema."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],

            model: "openai/gpt-oss-120b",

            temperature: 0.25,

            max_tokens: 10000,

            response_format: {
                type: "json_object"
            }
        });

        const responseText =
            chatCompletion.choices?.[0]?.message?.content || "{}";

        console.log("🤖 Groq response length:", responseText.length);

        const result = JSON.parse(responseText);

        validateInterviewReport(result);

        console.log("✅ Match Score:", result.matchScore);
        console.log("✅ Title:", result.title);
        console.log(
            "✅ Technical Questions:",
            result.technicalQuestions.length
        );
        console.log(
            "✅ Behavioral Questions:",
            result.behavioralQuestions.length
        );
        console.log("✅ Skill Gaps:", result.skillGaps.length);
        console.log(
            "✅ Preparation Days:",
            result.preparationPlan.length
        );

        return result;

    } catch (error) {

        console.error("❌ Groq Interview Generation Error:");
        console.error(error.message);


        throw new Error(
            `Interview report generation failed: ${error.message}`
        );
    }
}



function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function safeArray(value) {
    return Array.isArray(value) ? value : [];
}

function renderList(items = []) {
    return safeArray(items)
        .filter(item => item && String(item).trim())
        .map(item => `<li>${escapeHtml(item)}</li>`)
        .join("");
}

function renderSkills(skills = []) {
    return safeArray(skills)
        .filter(skill => skill && String(skill).trim())
        .map(skill => `<span class="skill">${escapeHtml(skill)}</span>`)
        .join("");
}

function renderEducation(education = []) {
    return safeArray(education)
        .map(item => `
            <div class="education-item">
                <div class="item-header">
                    <div>
                        <h3>${escapeHtml(item.degree || "")}</h3>
                        <div class="institution">
                            ${escapeHtml(item.institution || "")}
                        </div>
                    </div>
                    <div class="date">
                        ${escapeHtml(item.duration || "")}
                    </div>
                </div>

                ${item.details
                    ? `<div class="details">${escapeHtml(item.details)}</div>`
                    : ""
                }
            </div>
        `)
        .join("");
}

function renderProjects(projects = []) {
    return safeArray(projects)
        .map(project => `
            <div class="project">
                <h3>${escapeHtml(project.title || "")}</h3>

                ${project.description
                    ? `<p>${escapeHtml(project.description)}</p>`
                    : ""
                }

                ${project.points?.length
                    ? `<ul>${renderList(project.points)}</ul>`
                    : ""
                }
            </div>
        `)
        .join("");
}

function generateResumeHtml(data) {

    const name = escapeHtml(data.name || "Candidate");

    const headline = escapeHtml(
        data.headline || ""
    );

    const contactParts = [
        data.email,
        data.phone,
        data.location,
        data.linkedin
    ]
        .filter(Boolean)
        .map(item => escapeHtml(item));

    return `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<title>${name} - Resume</title>

<style>

@page {
    size: A4;
    margin: 14mm 15mm;
}

* {
    box-sizing: border-box;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    color: #222;
    margin: 0;
    padding: 0;
    font-size: 10.5pt;
    line-height: 1.45;
}

.resume {
    width: 100%;
}

.header {
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 2px solid #222;
}

.name {
    font-size: 25px;
    font-weight: 700;
    margin: 0 0 4px;
    letter-spacing: 0.2px;
}

.headline {
    font-size: 12px;
    margin-bottom: 7px;
    color: #444;
}

.contact {
    font-size: 9.5pt;
    color: #444;
}

.section {
    margin-top: 13px;
}

.section-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-bottom: 1px solid #777;
    padding-bottom: 3px;
    margin-bottom: 7px;
}

.summary {
    margin: 0;
    text-align: justify;
}

.item-header {
    display: flex;
    justify-content: space-between;
    gap: 15px;
}

h3 {
    margin: 0;
    font-size: 10.8pt;
}

.institution {
    margin-top: 2px;
    color: #444;
}

.date {
    white-space: nowrap;
    color: #444;
    font-size: 9.5pt;
}

.details {
    margin-top: 3px;
}

.education-item,
.project {
    margin-bottom: 8px;
}

ul {
    margin: 4px 0 0 17px;
    padding: 0;
}

li {
    margin-bottom: 2px;
}

.skills {
    display: flex;
    flex-wrap: wrap;
    gap: 5px 7px;
}

.skill {
    display: inline-block;
    border: 1px solid #999;
    padding: 3px 7px;
    border-radius: 3px;
    font-size: 9.5pt;
}

.two-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
}

.small-list {
    margin-top: 3px;
}

@media print {

    body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }

}

</style>

</head>

<body>

<div class="resume">

    <!-- HEADER -->

    <div class="header">

        <div class="name">
            ${name}
        </div>

        ${
            headline
                ? `<div class="headline">${headline}</div>`
                : ""
        }

        ${
            contactParts.length
                ? `<div class="contact">
                    ${contactParts.join(" | ")}
                   </div>`
                : ""
        }

    </div>


    <!-- SUMMARY -->

    ${
        data.summary
            ? `
            <div class="section">

                <div class="section-title">
                    Professional Summary
                </div>

                <p class="summary">
                    ${escapeHtml(data.summary)}
                </p>

            </div>
            `
            : ""
    }


    <!-- EDUCATION -->

    ${
        data.education?.length
            ? `
            <div class="section">

                <div class="section-title">
                    Education
                </div>

                ${renderEducation(data.education)}

            </div>
            `
            : ""
    }


    <!-- EXPERIENCE -->

    ${
        data.experience?.length
            ? `
            <div class="section">

                <div class="section-title">
                    Experience
                </div>

                ${data.experience.map(item => `
                    <div class="project">

                        <div class="item-header">

                            <div>
                                <h3>
                                    ${escapeHtml(item.role || "")}
                                </h3>

                                <div class="institution">
                                    ${escapeHtml(item.company || "")}
                                </div>
                            </div>

                            <div class="date">
                                ${escapeHtml(item.duration || "")}
                            </div>

                        </div>

                        ${
                            item.points?.length
                                ? `<ul>${renderList(item.points)}</ul>`
                                : ""
                        }

                    </div>
                `).join("")}

            </div>
            `
            : ""
    }


    <!-- PROJECTS -->

    ${
        data.projects?.length
            ? `
            <div class="section">

                <div class="section-title">
                    Projects
                </div>

                ${renderProjects(data.projects)}

            </div>
            `
            : ""
    }


    <!-- SKILLS -->

    ${
        data.skills?.length
            ? `
            <div class="section">

                <div class="section-title">
                    Skills
                </div>

                <div class="skills">
                    ${renderSkills(data.skills)}
                </div>

            </div>
            `
            : ""
    }


    <!-- CERTIFICATIONS / ACTIVITIES -->

    ${
        data.certifications?.length
            ? `
            <div class="section">

                <div class="section-title">
                    Certifications & Activities
                </div>

                <ul class="small-list">
                    ${renderList(data.certifications)}
                </ul>

            </div>
            `
            : ""
    }


    <!-- ADDITIONAL -->

    ${
        data.additional?.length
            ? `
            <div class="section">

                <div class="section-title">
                    Additional Information
                </div>

                <ul class="small-list">
                    ${renderList(data.additional)}
                </ul>

            </div>
            `
            : ""
    }

</div>

</body>

</html>
`;
}

// ────────────────────────────────────────────────────────
// 2. RESUME PDF GENERATION
// ────────────────────────────────────────────────────────

async function generateResumePdfGroq({
    resume,
    jobDescription,
    selfDescription
}) {

    try {

        console.log("📄 Generating structured resume...");

        const prompt = `
You are an expert professional resume editor.

Your task is to create structured resume data from the candidate's ORIGINAL RESUME.

The resume may be tailored toward the target job description, but you MUST follow these rules:

1. ORIGINAL RESUME IS THE SOURCE OF TRUTH.
2. NEVER invent:
   - name
   - email
   - phone
   - location
   - LinkedIn
   - company
   - job title
   - employment dates
   - education
   - degree
   - certification
   - achievement
   - project
   - metric
   - salary
   - skill that is not supported by the resume

3. You may improve wording and organization of existing information.

4. You may highlight existing skills that are relevant to the target job.

5. Do NOT copy the Job Description into the resume.

6. Do NOT add labels such as:
   - Target Role
   - About the Job
   - Job Description
   - Original Resume Content
   - AI Generated Resume

7. The final output must contain ONLY actual resume information.

8. If a field is not present in the original resume, return an empty string or empty array.

9. Do not create fake experience just because the candidate is applying for the job.

10. For a fresher/student, academic projects and coursework may be included only if they exist in the original resume.

TARGET JOB DESCRIPTION:

${jobDescription || "Not provided"}

CANDIDATE SELF DESCRIPTION:

${selfDescription || "Not provided"}

ORIGINAL RESUME:

${resume || "No resume content available"}

Return ONLY valid JSON.

Use exactly this structure:

{
  "name": "",
  "headline": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "summary": "",
  "education": [
    {
      "degree": "",
      "institution": "",
      "duration": "",
      "details": ""
    }
  ],
  "experience": [
    {
      "role": "",
      "company": "",
      "duration": "",
      "points": []
    }
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "points": []
    }
  ],
  "skills": [],
  "certifications": [],
  "additional": []
}

Important:

- Do not include the job description in any field.
- Do not include "ORIGINAL RESUME CONTENT".
- Do not include instructions.
- Do not include explanations outside JSON.
`;

        const completion =
            await groq.chat.completions.create({

                model: "openai/gpt-oss-120b",

                messages: [
                    {
                        role: "system",
                        content:
                            "You are a professional resume editor. Return only valid JSON and never invent candidate facts."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                temperature: 0.1,

                max_tokens: 7000,

                response_format: {
                    type: "json_object"
                }

            });


        const rawContent =
            completion.choices?.[0]?.message?.content;

        if (!rawContent) {
            throw new Error(
                "Empty response received from Groq"
            );
        }


        let resumeData;

        try {

            resumeData = JSON.parse(rawContent);

        } catch (parseError) {

            console.error(
                "❌ Resume JSON parse error:",
                parseError.message
            );

            console.error(
                "Raw Groq response:",
                rawContent
            );

            throw new Error(
                "Groq returned invalid resume JSON"
            );
        }



        resumeData.education =
            Array.isArray(resumeData.education)
                ? resumeData.education
                : [];

        resumeData.experience =
            Array.isArray(resumeData.experience)
                ? resumeData.experience
                : [];

        resumeData.projects =
            Array.isArray(resumeData.projects)
                ? resumeData.projects
                : [];

        resumeData.skills =
            Array.isArray(resumeData.skills)
                ? resumeData.skills
                : [];

        resumeData.certifications =
            Array.isArray(resumeData.certifications)
                ? resumeData.certifications
                : [];

        resumeData.additional =
            Array.isArray(resumeData.additional)
                ? resumeData.additional
                : [];


        const html =
            generateResumeHtml(resumeData);


        console.log("✅ Structured resume generated");

        return html;


    } catch (error) {

        console.error(
            "❌ Groq Resume Generation Error:"
        );

        console.error(error.message);

        throw new Error(
            `Resume generation failed: ${error.message}`
        );
    }
}


// ────────────────────────────────────────────────────────
// 3. SAFE RESUME FALLBACK
// ────────────────────────────────────────────────────────

function escapeHtml(value = "") {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function generateSafeResumeHtml({
    resume,
    selfDescription,
    jobDescription
}) {

    const safeResume = escapeHtml(resume || "");
    const safeSelfDescription = escapeHtml(selfDescription || "");
    const safeJobDescription = escapeHtml(jobDescription || "");

    return `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<title>Resume</title>

<style>

@page {
    size: A4;
    margin: 18mm 16mm;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: #222;
    font-size: 10.5pt;
    line-height: 1.45;
    background: white;
}

h1 {
    margin: 0 0 5px;
    font-size: 25px;
    color: #111;
}

h2 {
    margin: 18px 0 7px;
    padding-bottom: 4px;
    border-bottom: 1px solid #999;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

p {
    margin: 5px 0;
}

.resume-content {
    white-space: pre-wrap;
}

.target {
    font-size: 11px;
    color: #555;
    margin-bottom: 12px;
}

</style>

</head>

<body>

<header>

<h1>Resume</h1>

<div class="target">
Target Role: ${safeJobDescription}
</div>

</header>

${
    safeSelfDescription
        ? `
<section>
<h2>Professional Summary</h2>
<p>${safeSelfDescription}</p>
</section>
`
        : ""
}

<section>

<h2>Original Resume Content</h2>

<div class="resume-content">
${safeResume}
</div>

</section>

</body>

</html>
`;
}


async function generateMockInterviewQuestions({
    jobDescription,
    resume,
    selfDescription,
    technicalQuestions = [],
    behavioralQuestions = []
}) {

    try {

        const prompt = `
You are an AI interviewer conducting a realistic job interview.

Create a mock interview based specifically on:

1. Job Description
2. Candidate Resume
3. Candidate Self Description
4. Previously generated interview questions

The interview should feel like a real interview, not a list of random questions.

Rules:

- Generate 8 questions.
- Questions must be relevant to the target role.
- Use the candidate's resume where relevant.
- Do not assume skills or experience that are not present in the resume.
- Include a mixture of:
  - role-specific questions
  - resume-based questions
  - behavioral questions
  - practical/scenario questions
- Avoid generic questions that could apply to any job.
- Questions should become slightly more challenging as the interview progresses.
- Do not provide answers.
- Return ONLY valid JSON in this exact format:

{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5",
    "Question 6",
    "Question 7",
    "Question 8"
  ]
}
JOB DESCRIPTION:

${jobDescription || ""}

CANDIDATE RESUME:

${resume || ""}

CANDIDATE SELF DESCRIPTION:

${selfDescription || ""}

PREVIOUSLY GENERATED TECHNICAL QUESTIONS:

${JSON.stringify(technicalQuestions)}

PREVIOUSLY GENERATED BEHAVIORAL QUESTIONS:

${JSON.stringify(behavioralQuestions)}
`;


        const completion =
            await groq.chat.completions.create({

                model: "openai/gpt-oss-120b",

                messages: [

                    {
                        role: "system",
                        content:
                            "You are a professional AI interviewer. Return only valid JSON."
                    },

                    {
                        role: "user",
                        content: prompt
                    }

                ],

                temperature: 0.3,

                max_tokens: 4000,

                response_format: {
                    type: "json_object"
                }

            });


        const content =
            completion.choices?.[0]?.message?.content;


        if (!content) {

            throw new Error(
                "Empty response from Groq"
            );

        }


        const parsed =
            JSON.parse(content);


        // Support both:
        // { "questions": [...] }
        // and direct arrays if model returns them

        const questions =
            Array.isArray(parsed)
                ? parsed
                : parsed.questions;


        if (
            !Array.isArray(questions) ||
            questions.length === 0
        ) {

            throw new Error(
                "Invalid mock interview questions received"
            );

        }


        return questions
            .filter(
                question =>
                    typeof question === "string" &&
                    question.trim()
            )
            .slice(0, 8);


    } catch (error) {

        console.error(
            "❌ Mock Interview Question Generation Error:",
            error.message
        );

        throw new Error(
            `Mock interview generation failed: ${error.message}`
        );

    }

}



async function evaluateMockInterviewAnswer({
    jobDescription,
    resume,
    question,
    answer
}) {
    try {
        const prompt = `
You are an expert interviewer evaluating a candidate's answer.

Evaluate the answer based specifically on:
1. The Job Description
2. The Candidate Resume
3. The Interview Question
4. The Candidate's Answer

Rules:
- Score the answer from 0 to 10.
- Evaluate relevance, clarity, correctness, completeness, and alignment with the role.
- Do not penalize the candidate for not mentioning skills that are irrelevant to the question.
- Do not invent candidate experience or achievements.
- If the candidate's answer is reasonable but incomplete, explain what is missing.
- Feedback should be specific and actionable.
- Strengths must be based on the actual answer.
- Improvements must explain exactly what could be improved.
- Keep the feedback professional and concise.
- Return ONLY valid JSON.

Return ONLY this exact JSON structure:

{
  "score": 0,
  "feedback": "",
  "strengths": [
    "",
    ""
  ],
  "improvements": [
    "",
    ""
  ]
}

JOB DESCRIPTION:
${jobDescription || ""}

CANDIDATE RESUME:
${resume || ""}

INTERVIEW QUESTION:
${question || ""}

CANDIDATE ANSWER:
${answer || ""}
`;

        const completion =
            await groq.chat.completions.create({
                model: "openai/gpt-oss-120b",

                messages: [
                    {
                        role: "system",
                        content:
                            "You are a professional interview evaluator. Return only valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                temperature: 0.2,
                max_tokens: 3000,

                response_format: {
                    type: "json_object"
                }
            })

        const content =
            completion.choices?.[0]?.message?.content

        if (!content) {
            throw new Error("Empty response from Groq")
        }

        const parsed = JSON.parse(content)

        if (
            typeof parsed.score !== "number" ||
            typeof parsed.feedback !== "string" ||
            !Array.isArray(parsed.strengths) ||
            !Array.isArray(parsed.improvements)
        ) {
            throw new Error(
                "Invalid answer evaluation received"
            )
        }

        return {
            score: Math.max(
                0,
                Math.min(10, parsed.score)
            ),

            feedback: parsed.feedback.trim(),

            strengths: parsed.strengths
                .filter(
                    item =>
                        typeof item === "string" &&
                        item.trim()
                )
                .slice(0, 5),

            improvements: parsed.improvements
                .filter(
                    item =>
                        typeof item === "string" &&
                        item.trim()
                )
                .slice(0, 5)
        }

    } catch (error) {

        console.error(
            "❌ Mock Interview Answer Evaluation Error:",
            error.message
        )

        throw new Error(
            `Answer evaluation failed: ${error.message}`
        )
    }
}

async function generateMockInterviewSummary({
    jobDescription,
    resume,
    questions,
    answers
}) {
    try {
        const prompt = `
You are an expert interview coach.

Analyze the candidate's complete mock interview performance based on:
1. Job Description
2. Candidate Resume
3. Interview Questions
4. Evaluated Answers

Provide a concise overall performance summary.

Focus on:
- Overall performance
- Strong areas
- Weak areas
- Communication and technical quality
- What the candidate should improve before a real interview

Do not invent experience or achievements.
Base everything only on the provided information.
Keep the summary professional, specific, and actionable.
Return ONLY valid JSON.

Return exactly:

{
  "summary": ""
}

JOB DESCRIPTION:
${jobDescription || ""}

CANDIDATE RESUME:
${resume || ""}

INTERVIEW QUESTIONS:
${JSON.stringify(questions || [])}

EVALUATED ANSWERS:
${JSON.stringify(answers || [])}
`;

        const completion =
            await groq.chat.completions.create({
                model: "openai/gpt-oss-120b",

                messages: [
                    {
                        role: "system",
                        content:
                            "You are a professional interview coach. Return only valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                temperature: 0.2,
                max_tokens: 2000,

                response_format: {
                    type: "json_object"
                }
            })

        const content =
            completion.choices?.[0]?.message?.content

        if (!content) {
            throw new Error("Empty response from Groq")
        }

        const parsed = JSON.parse(content)

        if (
            typeof parsed.summary !== "string" ||
            !parsed.summary.trim()
        ) {
            throw new Error(
                "Invalid mock interview summary received"
            )
        }

        return parsed.summary.trim()

    } catch (error) {

        console.error(
            "❌ Mock Interview Summary Error:",
            error.message
        )

        throw new Error(
            `Mock interview summary failed: ${error.message}`
        )
    }
}


async function identifyWeakAreas({
    jobDescription,
    questions,
    answers
}) {
    try {
        const prompt = `
You are an expert technical interviewer and career coach.

Analyze the candidate's completed mock interview.

Identify the candidate's main weak areas based ONLY on:
1. Job Description
2. Interview Questions
3. Evaluated Answers

Look for:
- Repeated low scores
- Technical knowledge gaps
- Weak problem-solving explanations
- Poor answer structure
- Weak communication
- Missing important concepts
- Areas where the candidate needs more practice

Do not invent weaknesses that are not supported by the answers.

Return ONLY valid JSON in this exact format:

{
    "weakAreas": [
        "React performance optimization",
        "MongoDB indexing",
        "Behavioral answer structure"
    ]
}

JOB DESCRIPTION:
${jobDescription || ""}

INTERVIEW QUESTIONS:
${JSON.stringify(questions || [])}

EVALUATED ANSWERS:
${JSON.stringify(answers || [])}
`;

        const completion =
            await groq.chat.completions.create({
                model: "openai/gpt-oss-120b",

                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert interview coach. Return only valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                temperature: 0.2,

                max_tokens: 1500,

                response_format: {
                    type: "json_object"
                }
            });

        const content =
            completion.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error("Empty response from Groq");
        }

        const parsed = JSON.parse(content);

        if (
            !Array.isArray(parsed.weakAreas)
        ) {
            throw new Error(
                "Invalid weak areas received"
            );
        }

        return {
            weakAreas: parsed.weakAreas
                .filter(
                    item =>
                        typeof item === "string" &&
                        item.trim()
                )
                .map(item => item.trim())
                .slice(0, 5)
        };

    } catch (error) {

        console.error(
            "❌ Weak Area Analysis Error:",
            error.message
        );

        throw new Error(
            `Weak area analysis failed: ${error.message}`
        );
    }
}


async function generateWeakPracticeQuestions({
    jobDescription,
    weakAreas,
    previousAnswers
}) {
    try {
        const prompt = `
You are an expert technical interviewer and career coach.

Generate targeted interview practice questions specifically for the candidate's weak areas.

Use ONLY:
1. Job Description
2. Identified Weak Areas
3. Candidate's Previous Evaluated Answers

Rules:
- Generate exactly 5 questions.
- Questions must directly target the identified weak areas.
- Questions should be different from the candidate's previous questions.
- Questions should test understanding, practical application, and problem-solving.
- Keep questions relevant to the job role.
- Mix technical and behavioral questions when appropriate.
- Do not invent candidate experience.
- Questions should become slightly more challenging than the original weak areas.
- Return ONLY valid JSON.

Return exactly:

{
    "questions": [
        "",
        "",
        "",
        "",
        ""
    ]
}

JOB DESCRIPTION:
${jobDescription || ""}

IDENTIFIED WEAK AREAS:
${JSON.stringify(weakAreas || [])}

PREVIOUS EVALUATED ANSWERS:
${JSON.stringify(previousAnswers || [])}
`;

        const completion =
            await groq.chat.completions.create({
                model: "openai/gpt-oss-120b",

                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert interview coach. Return only valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                temperature: 0.3,
                max_tokens: 2000,

                response_format: {
                    type: "json_object"
                }
            });

        const content =
            completion.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error("Empty response from Groq");
        }

        const parsed = JSON.parse(content);

        if (!Array.isArray(parsed.questions)) {
            throw new Error(
                "Invalid weak practice questions received"
            );
        }

        const questions =
            parsed.questions
                .filter(
                    item =>
                        typeof item === "string" &&
                        item.trim()
                )
                .map(item => item.trim())
                .slice(0, 5);

        if (questions.length === 0) {
            throw new Error(
                "No weak practice questions generated"
            );
        }

        return questions;

    } catch (error) {

        console.error(
            "❌ Weak Practice Question Generation Error:",
            error.message
        );

        throw new Error(
            `Weak practice question generation failed: ${error.message}`
        );
    }
}

module.exports = {
    generateInterviewReportGroq,
    generateResumePdfGroq,
    generateMockInterviewQuestions,
    evaluateMockInterviewAnswer,
    generateMockInterviewSummary,
    identifyWeakAreas,
    generateWeakPracticeQuestions
};