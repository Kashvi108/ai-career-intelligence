# 🧠 AI Career Intelligence

> An AI-powered career and interview preparation platform that transforms a candidate's resume and target job description into personalized interview intelligence.

## 🚀 Overview

**AI Career Intelligence** is a full-stack MERN application designed to help candidates prepare for technical and behavioral interviews using AI.

The platform analyzes a candidate's **resume, job description, and self-description** to generate personalized career insights, interview questions, skill-gap analysis, preparation roadmaps, mock interview evaluations, and targeted weak-area practice.

The application combines **React, Node.js, Express, MongoDB, Mongoose, JWT authentication, and Groq AI** into a complete AI-driven interview preparation workflow.

---

## ✨ Key Features

### 📄 Resume & Job Description Intelligence

* Upload candidate resume in PDF or DOCX format
* Analyze resume against a target job description
* Generate an overall resume–JD match score
* Analyze:

  * Skills Match
  * Experience Match
  * Role Alignment
  * Matching Evidence
  * Missing / Weak Areas
  * Important Job Requirements
  * Relevant Strengths
  * Improvement Suggestions

### 🤖 AI Interview Preparation

* AI-generated technical interview questions
* AI-generated behavioral interview questions
* Personalized skill-gap analysis
* Personalized interview preparation roadmap
* Questions generated according to the candidate's target role

### 🎤 AI Mock Interview

* Complete AI-driven mock interview experience
* Question-by-question interview flow
* AI evaluation of every answer
* Score for each answer
* AI feedback
* Identified strengths
* Suggested improvements
* Overall interview score
* AI-generated performance summary

### 🎯 Weak Area Practice

* Automatically identifies recurring weak areas from mock interview performance
* Generates targeted practice questions
* Evaluates practice answers using AI
* Tracks practice progress
* Calculates overall practice score
* Provides answer-by-answer feedback

### 🔐 Authentication & Security

* JWT-based authentication
* Protected frontend routes
* User-specific interview data
* User-specific mock interview sessions
* User-specific weak-area practice sessions
* Secure environment variable configuration

### 📑 Resume Processing

* PDF resume parsing
* DOCX resume parsing
* AI-powered resume analysis
* AI-generated resume PDF functionality

### 🎨 AI Career Intelligence UI

* Premium dark AI-themed interface
* Responsive React UI
* Interactive AI Brain visualizations
* Dedicated career intelligence dashboard
* Mock interview interface
* Weak-area practice interface

---

## 🧩 Application Workflow

```text
                    ┌─────────────────────┐
                    │       Register      │
                    │       / Login       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Career Workspace  │
                    │                     │
                    │ Resume + JD +       │
                    │ Self Description     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    AI Analysis      │
                    │                     │
                    │ Resume ↔ JD Match    │
                    │ Skills               │
                    │ Experience           │
                    │ Role Alignment       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Interview Intel.    │
                    │                     │
                    │ Technical Questions │
                    │ Behavioral Questions│
                    │ Skill Gap           │
                    │ Preparation Roadmap │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   AI Mock Interview │
                    │                     │
                    │ Answer → Evaluate   │
                    │ Score → Feedback    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Weak Area Engine  │
                    │                     │
                    │ Identify Weaknesses │
                    │ Generate Practice   │
                    │ Evaluate Answers    │
                    └─────────────────────┘
```

---

## 🏗️ Architecture

```text
Frontend
React + Vite
     │
     │ REST API
     ▼
Backend
Node.js + Express
     │
     ├──────────────► MongoDB
     │
     └──────────────► Groq AI
                       │
                       ▼
                AI Generation &
                  Evaluation
```

### Frontend

Built with:

* React.js
* Vite
* React Router
* Axios
* Framer Motion
* SCSS

### Backend

Built with:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* PDF parsing
* DOCX parsing

### AI Layer

Powered by:

* Groq API
* `openai/gpt-oss-120b`

AI is used for:

* Interview question generation
* Resume analysis
* Job-description matching
* Skill-gap analysis
* Preparation roadmap generation
* Mock interview evaluation
* Performance summarization
* Weak-area identification
* Targeted practice generation

---

## 🛠️ Tech Stack

| Category       | Technology         |
| -------------- | ------------------ |
| Frontend       | React.js           |
| Build Tool     | Vite               |
| Styling        | SCSS               |
| Backend        | Node.js            |
| API            | Express.js         |
| Database       | MongoDB            |
| ODM            | Mongoose           |
| Authentication | JWT                |
| AI             | Groq API           |
| AI Model       | GPT OSS 120B       |
| HTTP Client    | Axios              |
| File Upload    | Multer             |
| Resume Parsing | PDF / DOCX parsing |
| Routing        | React Router       |
| Animations     | Framer Motion      |

---

## 📁 Project Structure

```text
ai-career-intelligence/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── interview/
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Kashvi108/ai-career-intelligence.git
cd ai-career-intelligence
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the `backend` directory.

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

> Never commit your `.env` file or API keys to GitHub.

### 4. Start the backend

```bash
npm start
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

The application will then be available through the Vite development server.

---

## 🔐 Environment Variables

The application requires environment-specific configuration for:

* MongoDB connection
* JWT authentication
* Groq API access
* Backend server configuration

Example:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_api_key
```

**Do not use real credentials in the repository.**

---

## 🧠 AI Capabilities

The AI layer is designed around the candidate's actual career context rather than generating completely generic interview content.

### Input

```text
Resume
+
Job Description
+
Self Description
+
Interview Performance
```

### AI Processing

```text
Candidate Context
       ↓
Resume / JD Analysis
       ↓
Career Intelligence
       ↓
Interview Generation
       ↓
Answer Evaluation
       ↓
Weak Area Detection
       ↓
Targeted Practice
```

This creates a continuous preparation loop where interview performance can influence subsequent practice.

---

## 📊 Core AI Modules

### Resume–JD Matching

Analyzes compatibility between the candidate's resume and target role.

### Interview Question Generation

Generates role-specific technical and behavioral questions.

### Answer Evaluation

Evaluates answers using:

* Relevance
* Technical understanding
* Explanation quality
* Problem-solving
* Communication
* Role-specific expectations

### Weak Area Detection

Analyzes evaluated answers to identify recurring areas that require improvement.

### Targeted Practice

Uses identified weak areas and previous answers to generate additional practice questions.

---

## 🔒 Security Considerations

* Authentication-protected API routes
* User-specific database queries
* JWT-based authentication
* Environment variables for secrets
* `.env` excluded through `.gitignore`
* Resume processing performed on the backend

---

## 🎯 Future Improvements

Potential future enhancements include:

* Google OAuth
* GitHub OAuth
* Interview analytics dashboard
* Voice-based mock interviews
* Speech-to-text interview answers
* AI-generated interview reports
* Advanced candidate progress tracking
* Deployment with production infrastructure
* Cloud resume storage
* Recruiter / interviewer mode

---

## 👩‍💻 Author

**Kashvi**

Full Stack Developer | AI Application Development

GitHub:
https://github.com/Kashvi108

---

## ⭐ Project Highlights

This project demonstrates practical experience with:

* Full-stack MERN development
* REST API design
* Authentication and protected routes
* MongoDB data modeling
* AI / LLM integration
* Prompt engineering
* AI response evaluation
* Resume document processing
* Personalized recommendation systems
* Complex multi-step application workflows
* Responsive frontend development

---

## 📜 License

This project is currently available for educational and portfolio purposes.
