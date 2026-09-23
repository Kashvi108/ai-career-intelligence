import React, { useState, useRef, useContext } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { AuthContext } from '../../auth/auth.context.jsx'
import './home.scss'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const { user, logout } = useContext(AuthContext)

    const latestReport = reports?.[0]

const readiness = latestReport?.matchScore ?? 0
const skillMatch = latestReport?.matchBreakdown?.skillsMatch ?? 0
const riskAreas = latestReport?.matchBreakdown
    ? [
        latestReport.matchBreakdown.experienceMatch,
        latestReport.matchBreakdown.roleAlignment
      ].filter(score => score < 50).length
    : 0

    const experienceMatch = latestReport?.matchBreakdown?.experienceMatch ?? 0
const roleAlignment = latestReport?.matchBreakdown?.roleAlignment ?? 0
const targetRole = latestReport?.title || 'TARGET ROLE'

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFileName, setResumeFileName] = useState("")
    const [activeBrainNode, setActiveBrainNode] = useState('skills')

    const resumeInputRef = useRef()
    const navigate = useNavigate()
    

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]

        if (!resumeFile) {
            alert("Please select a resume file first!")
            return
        }

        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile
        })

        navigate(`/interview/${data._id}`)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            setResumeFileName(file.name)
            console.log("📄 File selected:", file)
        } else {
            setResumeFileName("")
        }
    }

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="loading-core">
                    <span />
                    <span />
                    <span />
                </div>

                <p>AI is analyzing your career signals...</p>
            </main>
        )
    }

    return (
        <div className="home-page">

            {/* =========================================
                TOP INTELLIGENCE HEADER
            ========================================= */}

            <header className="command-header">

                <div className="command-heading">

                    <div className="command-eyebrow">
                        <span className="command-dot" />
                        AI CAREER INTELLIGENCE
                    </div>

                    <h1>
                        Build your
                        <span> Career Brain.</span>
                    </h1>

                    <p>
                        Give the AI your target role and career data.
                        It will connect the signals and build your
                        personalized interview strategy.
                    </p>

                </div>

                <div className="system-status">

                    <span className="status-pulse" />

                    <div>
                        <small>SYSTEM STATUS</small>
                        <strong>AI ENGINE READY</strong>
                    </div>

                </div>

                <div className="command-header__actions">
    <span className="command-user">
        {user?.username || user?.email || "USER"}
    </span>

    <button
        className="logout-button"
        onClick={logout}
    >
        Logout
    </button>
</div>

            </header>


            {/* =========================================
                MAIN AI WORKSPACE
            ========================================= */}

            <main className="career-workspace">

                {/* =====================================
                    LEFT — INPUT INTELLIGENCE
                ===================================== */}

                <section className="intelligence-card input-card">

                    <div className="card-top">

                        <div>
                            <span className="module-label">
                                01 / INPUT
                            </span>

                            <h2>
                                Feed your career signals
                            </h2>

                            <p>
                                The more context you provide,
                                the more precise your AI strategy becomes.
                            </p>
                        </div>

                        <div className="module-icon">
                            ✦
                        </div>

                    </div>


                    {/* TARGET ROLE */}

                    <div className="input-module">

                        <div className="module-title">

                            <span className="module-number">
                                01
                            </span>

                            <div>
                                <strong>Target Role</strong>
                                <small>
                                    What are you preparing for?
                                </small>
                            </div>

                            <span className="required-tag">
                                REQUIRED
                            </span>

                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) =>
                                setJobDescription(e.target.value)
                            }
                            className="ai-textarea"
                            placeholder="Paste the job description here..."
                            maxLength={5000}
                        />

                        <div className="textarea-meta">
                            <span>JOB DESCRIPTION</span>
                            <span>{jobDescription.length} / 5000</span>
                        </div>

                    </div>


                    {/* RESUME */}

                    <div className="input-module">

                        <div className="module-title">

                            <span className="module-number">
                                02
                            </span>

                            <div>
                                <strong>Career Profile</strong>
                                <small>
                                    Upload your resume
                                </small>
                            </div>

                            <span className="recommended-tag">
                                RECOMMENDED
                            </span>

                        </div>


                        <label
                            className={`ai-dropzone ${
                                resumeFileName
                                    ? "has-file"
                                    : ""
                            }`}
                            htmlFor="resume"
                        >

                            <div className="dropzone-orbit">
                                {resumeFileName ? "✓" : "↑"}
                            </div>

                            <div>

                                <strong>
                                    {resumeFileName
                                        ? resumeFileName
                                        : "Drop your resume here"}
                                </strong>

                                <span>
                                    {resumeFileName
                                        ? "Click to replace file"
                                        : "PDF or DOCX · Maximum 5MB"}
                                </span>

                            </div>

                            <input
                                ref={resumeInputRef}
                                hidden
                                type="file"
                                id="resume"
                                name="resume"
                                accept=".pdf,.docx"
                                onChange={handleFileChange}
                            />

                        </label>

                    </div>


                    {/* SELF DESCRIPTION */}

                    <div className="input-module">

                        <div className="module-title">

                            <span className="module-number">
                                03
                            </span>

                            <div>
                                <strong>Personal Signal</strong>
                                <small>
                                    Tell the AI about yourself
                                </small>
                            </div>

                            <span className="optional-tag">
                                OPTIONAL
                            </span>

                        </div>

                        <textarea
                            value={selfDescription}
                            onChange={(e) =>
                                setSelfDescription(e.target.value)
                            }
                            className="ai-textarea short"
                            placeholder="Describe your experience, strongest skills, years of experience, or anything the AI should know..."
                        />

                    </div>


                    {/* GENERATE */}

                    <div className="generate-zone">

                        <div className="generate-info">

                            <span className="generate-signal">
                                <span />
                                AI READY
                            </span>

                            <p>
                                Your data stays within your
                                personalized career intelligence session.
                            </p>

                        </div>

                        <button
                            onClick={handleGenerateReport}
                            className="generate-ai-btn"
                        >
                            <span>Generate Career Intelligence</span>
                            <b>→</b>
                        </button>

                    </div>

                </section>


                {/* =====================================
                    RIGHT — AI BRAIN
                ===================================== */}

                <aside className="intelligence-card brain-card">

                    <div className="brain-card-header">

                        <div>
                            <span className="module-label">
                                CAREER BRAIN
                            </span>

                            <h2>
                                Your AI Core
                            </h2>
                        </div>

                        <span className="live-badge">
                            LIVE
                        </span>

                    </div>


                    <div
    className="career-brain"
    style={{
        position: 'relative',
        overflow: 'hidden'
    }}
>

                        <div className="brain-grid" />

                        <div className="brain-orbit orbit-a" />
                        <div className="brain-orbit orbit-b" />
                        <div className="brain-orbit orbit-c" />

                        <span className="brain-connection connection-a" />
                        <span className="brain-connection connection-b" />
                        <span className="brain-connection connection-c" />
                        <span className="brain-connection connection-d" />
                            <div
    className={`brain-node brain-node--skills ${activeBrainNode === 'skills' ? 'is-active' : ''}`}
    onMouseEnter={() => setActiveBrainNode('skills')}
    style={{
        position: 'absolute',
        top: '28%',
        left: '7%',
        zIndex: 10,
        width: '82px',
        minHeight: '48px',
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        boxSizing: 'border-box'
    }}
>
    <span>SKILLS</span>
    <strong>{skillMatch}%</strong>
</div>

<div
    className={`brain-node brain-node--role ${activeBrainNode === 'role' ? 'is-active' : ''}`}
    onMouseEnter={() => setActiveBrainNode('role')}
    style={{
        position: 'absolute',
        top: '9%',
        left: '40%',
        zIndex: 10,
        width: '82px',
        minHeight: '48px',
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        boxSizing: 'border-box'
    }}
>
    <span>ROLE</span>
    <strong>{roleAlignment}%</strong>
</div>

<div
    className={`brain-node brain-node--resume ${activeBrainNode === 'experience' ? 'is-active' : ''}`}
    onMouseEnter={() => setActiveBrainNode('experience')}
    style={{
        position: 'absolute',
        bottom: '15%',
        left: '8%',
        zIndex: 10,
        width: '82px',
        minHeight: '48px',
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        boxSizing: 'border-box'
    }}
>
    <span>EXPERIENCE</span>
    <strong>{experienceMatch}%</strong>
</div>

<div
    className={`brain-node brain-node--interview ${activeBrainNode === 'readiness' ? 'is-active' : ''}`}
    onMouseEnter={() => setActiveBrainNode('readiness')}
    style={{
        position: 'absolute',
        bottom: '25%',
        left: '42%',
        zIndex: 10,
        width: '82px',
        minHeight: '48px',
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        boxSizing: 'border-box'
    }}
>
    <span>READINESS</span>
    <strong>{readiness}%</strong>
</div>


                        <div className="career-core">

                            <div className="career-core-inner">

                                <span>AI</span>

                                <small>
                                    CORE
                                </small>

                            </div>

                        </div>

                    </div>

<div className="brain-message">
    <span>✦</span>
    <p>
        {activeBrainNode === 'skills' &&
            `Skill alignment is ${skillMatch}%. Focus on strengthening the skills most relevant to ${targetRole}.`
        }

        {activeBrainNode === 'role' &&
            `Role alignment is ${roleAlignment}%. Your profile is being compared against the target role.`
        }

        {activeBrainNode === 'experience' &&
            `Experience alignment is ${experienceMatch}%. Highlight your most relevant experience when preparing.`
        }

        {activeBrainNode === 'readiness' &&
            `Overall readiness is ${readiness}%. Your Career Brain has identified areas to strengthen before the interview.`
        }
    </p>
</div>


                    {/* <div className="brain-metric">
                        <span>READINESS</span>
                        <strong>{readiness}%</strong>
                    </div>

                    <div className="brain-metric">
                        <span>SKILL MATCH</span>
                        <strong>{skillMatch}%</strong>
                    </div>

                    <div className="brain-metric">
                        <span>RISK AREAS</span>
                        <strong>{riskAreas}</strong>
                    </div> */}

                </aside>

            </main>


            {/* =========================================
                RECENT INTELLIGENCE
            ========================================= */}

            {reports.length > 0 && (

                <section className="recent-intelligence">

                    <div className="section-heading">

                        <div>

                            <span className="module-label">
                                INTELLIGENCE HISTORY
                            </span>

                            <h2>
                                Your previous career sessions
                            </h2>

                        </div>

                        <span className="session-count">
                            {reports.length} SESSION
                            {reports.length > 1 ? "S" : ""}
                        </span>

                    </div>


                    <div className="reports-grid">

                        {reports.map((report) => (

                            <article
                                key={report._id}
                                className="intelligence-session"
                                onClick={() =>
                                    navigate(
                                        `/interview/${report._id}`
                                    )
                                }
                            >

                                <div className="session-top">

                                    <span className="session-index">
                                        #{String(
                                            reports.indexOf(report) + 1
                                        ).padStart(2, "0")}
                                    </span>

                                    <span className="session-arrow">
                                        ↗
                                    </span>

                                </div>

                                <h3>
                                    {report.title ||
                                        "Untitled Position"}
                                </h3>

                                <p>
                                    Generated on{" "}
                                    {new Date(
                                        report.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <div className="session-score">

                                    <span>
                                        MATCH SIGNAL
                                    </span>

                                    <strong>
                                        {report.matchScore}%
                                    </strong>

                                </div>

                            </article>

                        ))}

                    </div>

                </section>

            )}


            <footer className="home-footer">

                <span>
                    AI CAREER INTELLIGENCE SYSTEM
                </span>

                <div>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Help</a>
                </div>

            </footer>

        </div>
    )
}

export default Home