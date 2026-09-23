import React, { useState, useEffect } from 'react'

import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import './interview.scss'


// =====================================================
// NAVIGATION
// =====================================================

const NAV_ITEMS = [
    {
        id: 'overview',
        label: 'Career Overview',
        icon: '⌁'
    },
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: '</>'
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: '◌'
    },
    {
        id: 'skillgap',
        label: 'Skill Gap',
        icon: '△'
    },
    {
        id: 'roadmap',
        label: 'Preparation Roadmap',
        icon: '↗'
    },
    {
        id: 'match',
        label: 'Match Breakdown',
        icon: '◎'
    }
]


// =====================================================
// QUESTION CARD
// =====================================================

const QuestionCard = ({ item, index }) => {

    const [open, setOpen] = useState(false)

    return (
        <article
            className={`iq-card ${open ? 'iq-card--open' : ''}`}
        >

            <button
                className="iq-card__header"
                onClick={() => setOpen(value => !value)}
            >

                <span className="iq-card__number">
                    {String(index + 1).padStart(2, '0')}
                </span>

                <span className="iq-card__question">
                    {item.question}
                </span>

                <span className="iq-card__toggle">
                    {open ? '−' : '+'}
                </span>

            </button>


            {open && (

                <div className="iq-card__body">

                    {item.intention && (
                        <div className="answer-block">

                            <span className="answer-label">
                                INTENTION
                            </span>

                            <p>
                                {item.intention}
                            </p>

                        </div>
                    )}


                    {item.answer && (
                        <div className="answer-block">

                            <span className="answer-label">
                                MODEL ANSWER
                            </span>

                            <p>
                                {item.answer}
                            </p>

                        </div>
                    )}

                </div>

            )}

        </article>
    )
}


// =====================================================
// ROADMAP DAY
// =====================================================

const RoadMapDay = ({ day }) => {

    return (
        <article className="roadmap-card">

            <div className="roadmap-card__number">
                DAY {String(day.day).padStart(2, '0')}
            </div>

            <div className="roadmap-card__content">

                <h3>
                    {day.focus}
                </h3>

                <ul>

                    {day.tasks?.map((task, index) => (

                        <li key={index}>

                            <span className="roadmap-dot" />

                            {task}

                        </li>

                    ))}

                </ul>

            </div>

        </article>
    )
}


// =====================================================
// SCORE BAR
// =====================================================

const ScoreBar = ({ label, value }) => {

    return (
        <div className="score-bar">

            <div className="score-bar__top">

                <span>
                    {label}
                </span>

                <strong>
                    {value}%
                </strong>

            </div>

            <div className="score-bar__track">

                <div
                    className="score-bar__fill"
                    style={{
                        width: `${Math.min(value || 0, 100)}%`
                    }}
                />

            </div>

        </div>
    )
}


// =====================================================
// MAIN
// =====================================================

const Interview = () => {

    const [activeNav, setActiveNav] = useState('overview')

    const {
        report,
        getReportById,
        loading,
        getResumePdf,
        startMock
    } = useInterview()


    const { interviewId } = useParams()

    const navigate = useNavigate()


    // =================================================
    // LOAD REPORT
    // =================================================

    useEffect(() => {

        if (interviewId) {
            getReportById(interviewId)
        }

    }, [interviewId])


    if (loading || !report) {

        return (

            <main className="intelligence-loading">

                <div className="loading-core">

                    <div className="loading-core__ring" />

                    <div className="loading-core__center">
                        AI
                    </div>

                </div>

                <span>
                    CAREER INTELLIGENCE
                </span>

                <h1>
                    Analyzing your career profile...
                </h1>

                <p>
                    Building your personalized interview intelligence.
                </p>

            </main>

        )
    }


    // =================================================
    // DATA
    // =================================================

    const matchBreakdown = report.matchBreakdown || {}

    const readiness = report.matchScore || 0

    const skillMatch =
        matchBreakdown.skillsMatch ?? 0

    const experienceMatch =
        matchBreakdown.experienceMatch ?? 0

    const roleAlignment =
        matchBreakdown.roleAlignment ?? 0


    const technicalQuestions =
        report.technicalQuestions || []

    const behavioralQuestions =
        report.behavioralQuestions || []

    const skillGaps =
        report.skillGaps || []

    const preparationPlan =
        report.preparationPlan || []


    const targetRole =
        report.title || 'Target Role'


    // =================================================
    // HELPERS
    // =================================================

    const getScoreClass = (score) => {

        if (score >= 80) return 'score-good'

        if (score >= 60) return 'score-medium'

        return 'score-low'

    }


    const handleMockInterview = async () => {

        const mockInterview =
            await startMock(interviewId)

        if (mockInterview) {

            navigate(
                `/mock-interview/${mockInterview._id}`
            )

        }

    }


    // =================================================
    // RENDER
    // =================================================

    return (

        <div className="intelligence-page">


            {/* =================================================
                TOP BAR
            ================================================= */}

            <header className="intelligence-header">

                <div className="intelligence-brand">

                    <div className="brand-core">
                        AI
                    </div>

                    <div>

                        <span>
                            AI CAREER INTELLIGENCE
                        </span>

                        <strong>
                            Career Brain
                        </strong>

                    </div>

                </div>


                <div className="header-status">

                    <span className="status-dot" />

                    ANALYSIS COMPLETE

                </div>


                <button
                    className="download-resume"
                    onClick={() =>
                        getResumePdf(interviewId)
                    }
                >
                    ↓ Download Resume
                </button>

            </header>



            {/* =================================================
                MAIN LAYOUT
            ================================================= */}

            <div className="intelligence-layout">


                {/* =================================================
                    LEFT SIDEBAR
                ================================================= */}

                <aside className="intelligence-nav">

                    <div className="nav-heading">

                        <span>
                            INTELLIGENCE MODULES
                        </span>

                    </div>


                    <div className="nav-items">

                        {NAV_ITEMS.map(item => (

                            <button
                                key={item.id}
                                className={
                                    activeNav === item.id
                                        ? 'nav-item nav-item--active'
                                        : 'nav-item'
                                }
                                onClick={() =>
                                    setActiveNav(item.id)
                                }
                            >

                                <span className="nav-item__icon">
                                    {item.icon}
                                </span>

                                <span>
                                    {item.label}
                                </span>

                            </button>

                        ))}

                    </div>


                    {/* MOCK INTERVIEW */}

                    <div className="mock-launch">

                        <span className="mock-launch__label">
                            READY TO PRACTICE?
                        </span>

                        <h3>
                            Test your readiness
                        </h3>

                        <p>
                            Start an AI-powered mock interview based on this role.
                        </p>

                        <button
                            onClick={handleMockInterview}
                        >
                            Start Mock Interview →
                        </button>

                    </div>

                </aside>



                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="intelligence-content">


                    {/* =================================================
                        OVERVIEW
                    ================================================= */}

                    {activeNav === 'overview' && (

                        <section className="module">

                            <div className="module-intro">

                                <div>

                                    <span className="module-eyebrow">
                                        CAREER INTELLIGENCE / 01
                                    </span>

                                    <h1>
                                        Your Career Brain
                                    </h1>

                                    <p>
                                        AI analysis for
                                        <strong>
                                            {targetRole}
                                        </strong>
                                    </p>

                                </div>


                                <div className="analysis-complete">

                                    <span />

                                    Intelligence generated

                                </div>

                            </div>


                            {/* HERO INTELLIGENCE */}

                            <div className="brain-overview">

                                <div className="brain-visual">

                                    <div className="brain-grid" />

                                    <div className="brain-orbit brain-orbit--one" />
                                    <div className="brain-orbit brain-orbit--two" />
                                    <div className="brain-orbit brain-orbit--three" />


                                    <div className="brain-node brain-node--top">
                                        <span>ROLE</span>
                                        <strong>
                                            {roleAlignment}%
                                        </strong>
                                    </div>


                                    <div className="brain-node brain-node--left">
                                        <span>SKILLS</span>
                                        <strong>
                                            {skillMatch}%
                                        </strong>
                                    </div>


                                    <div className="brain-node brain-node--bottom">
                                        <span>EXPERIENCE</span>
                                        <strong>
                                            {experienceMatch}%
                                        </strong>
                                    </div>


                                    <div className="brain-core">

                                        <span>
                                            AI
                                        </span>

                                        <small>
                                            CORE
                                        </small>

                                    </div>

                                </div>


                                <div className="brain-summary">

                                    <span className="summary-label">
                                        OVERALL READINESS
                                    </span>

                                    <strong className={getScoreClass(readiness)}>
                                        {readiness}%
                                    </strong>

                                    <p>
                                        Your current profile-to-role
                                        alignment based on resume,
                                        experience and target requirements.
                                    </p>


                                    <div className="summary-status">

                                        <span />

                                        Career intelligence active

                                    </div>

                                </div>

                            </div>


                            {/* SCORE MATRIX */}

                            <div className="score-matrix">

                                <ScoreBar
                                    label="Skills Match"
                                    value={skillMatch}
                                />

                                <ScoreBar
                                    label="Experience Match"
                                    value={experienceMatch}
                                />

                                <ScoreBar
                                    label="Role Alignment"
                                    value={roleAlignment}
                                />

                            </div>


                            {/* QUICK MODULES */}

                            <div className="quick-grid">

                                <button
                                    onClick={() =>
                                        setActiveNav('technical')
                                    }
                                >

                                    <span>
                                        TECHNICAL
                                    </span>

                                    <strong>
                                        {technicalQuestions.length}
                                    </strong>

                                    <small>
                                        AI-generated questions →
                                    </small>

                                </button>


                                <button
                                    onClick={() =>
                                        setActiveNav('behavioral')
                                    }
                                >

                                    <span>
                                        BEHAVIORAL
                                    </span>

                                    <strong>
                                        {behavioralQuestions.length}
                                    </strong>

                                    <small>
                                        Interview questions →
                                    </small>

                                </button>


                                <button
                                    onClick={() =>
                                        setActiveNav('skillgap')
                                    }
                                >

                                    <span>
                                        SKILL GAP
                                    </span>

                                    <strong>
                                        {skillGaps.length}
                                    </strong>

                                    <small>
                                        Areas to improve →
                                    </small>

                                </button>


                                <button
                                    onClick={() =>
                                        setActiveNav('roadmap')
                                    }
                                >

                                    <span>
                                        ROADMAP
                                    </span>

                                    <strong>
                                        {preparationPlan.length}
                                    </strong>

                                    <small>
                                        Days of preparation →
                                    </small>

                                </button>

                            </div>

                        </section>

                    )}



                    {/* =================================================
                        TECHNICAL
                    ================================================= */}

                    {activeNav === 'technical' && (

                        <section className="module">

                            <div className="module-intro">

                                <div>

                                    <span className="module-eyebrow">
                                        INTERVIEW INTELLIGENCE / 02
                                    </span>

                                    <h1>
                                        Technical Questions
                                    </h1>

                                    <p>
                                        Questions generated specifically
                                        for <strong>{targetRole}</strong>.
                                    </p>

                                </div>

                                <span className="module-count">
                                    {technicalQuestions.length} QUESTIONS
                                </span>

                            </div>


                            <div className="question-list">

                                {technicalQuestions.map(
                                    (item, index) => (

                                        <QuestionCard
                                            key={index}
                                            item={item}
                                            index={index}
                                        />

                                    )
                                )}

                            </div>

                        </section>

                    )}



                    {/* =================================================
                        BEHAVIORAL
                    ================================================= */}

                    {activeNav === 'behavioral' && (

                        <section className="module">

                            <div className="module-intro">

                                <div>

                                    <span className="module-eyebrow">
                                        INTERVIEW INTELLIGENCE / 03
                                    </span>

                                    <h1>
                                        Behavioral Questions
                                    </h1>

                                    <p>
                                        Questions designed to prepare
                                        you for behavioral evaluation.
                                    </p>

                                </div>

                                <span className="module-count">
                                    {behavioralQuestions.length} QUESTIONS
                                </span>

                            </div>


                            <div className="question-list">

                                {behavioralQuestions.map(
                                    (item, index) => (

                                        <QuestionCard
                                            key={index}
                                            item={item}
                                            index={index}
                                        />

                                    )
                                )}

                            </div>

                        </section>

                    )}



                    {/* =================================================
                        SKILL GAP
                    ================================================= */}

                    {activeNav === 'skillgap' && (

                        <section className="module">

                            <div className="module-intro">

                                <div>

                                    <span className="module-eyebrow">
                                        CAREER INTELLIGENCE / 04
                                    </span>

                                    <h1>
                                        Skill Gap Analysis
                                    </h1>

                                    <p>
                                        Signals your profile should
                                        strengthen before the interview.
                                    </p>

                                </div>

                                <span className="module-count">
                                    {skillGaps.length} SIGNALS
                                </span>

                            </div>


                            <div className="skill-gap-grid">

                                {skillGaps.map((gap, index) => (

                                    <article
                                        key={index}
                                        className={`skill-gap-card skill-gap-card--${gap.severity || 'medium'}`}
                                    >

                                        <div className="skill-gap-card__top">

                                            <span>
                                                {String(index + 1).padStart(2, '0')}
                                            </span>

                                            <span className="severity">
                                                {gap.severity || 'focus'}
                                            </span>

                                        </div>

                                        <h3>
                                            {gap.skill}
                                        </h3>

                                        {gap.reason && (
                                            <p>
                                                {gap.reason}
                                            </p>
                                        )}

                                    </article>

                                ))}

                            </div>

                        </section>

                    )}



                    {/* =================================================
                        ROADMAP
                    ================================================= */}

                    {activeNav === 'roadmap' && (

                        <section className="module">

                            <div className="module-intro">

                                <div>

                                    <span className="module-eyebrow">
                                        PREPARATION INTELLIGENCE / 05
                                    </span>

                                    <h1>
                                        Your Preparation Roadmap
                                    </h1>

                                    <p>
                                        A personalized sequence for
                                        improving your interview readiness.
                                    </p>

                                </div>

                                <span className="module-count">
                                    {preparationPlan.length} DAYS
                                </span>

                            </div>


                            <div className="roadmap-list">

                                {preparationPlan.map(day => (

                                    <RoadMapDay
                                        key={day.day}
                                        day={day}
                                    />

                                ))}

                            </div>

                        </section>

                    )}



                    {/* =================================================
                        MATCH BREAKDOWN
                    ================================================= */}

                    {activeNav === 'match' && (

                        <section className="module">

                            <div className="module-intro">

                                <div>

                                    <span className="module-eyebrow">
                                        RESUME × JOB DESCRIPTION / 06
                                    </span>

                                    <h1>
                                        Match Breakdown
                                    </h1>

                                    <p>
                                        Detailed evidence behind your
                                        career intelligence score.
                                    </p>

                                </div>

                                <span className="module-count">
                                    {readiness}% MATCH
                                </span>

                            </div>


                            {/* SCORE CARDS */}

                            <div className="match-score-grid">

                                <div>
                                    <span>
                                        OVERALL
                                    </span>

                                    <strong>
                                        {matchBreakdown.overallMatchScore ?? readiness}%
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        SKILLS
                                    </span>

                                    <strong>
                                        {skillMatch}%
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        EXPERIENCE
                                    </span>

                                    <strong>
                                        {experienceMatch}%
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        ROLE
                                    </span>

                                    <strong>
                                        {roleAlignment}%
                                    </strong>
                                </div>

                            </div>


                            {/* MATCHING EVIDENCE */}

                            <div className="insight-section">

                                <div className="insight-section__heading">

                                    <span>
                                        01
                                    </span>

                                    <h2>
                                        Matching Evidence
                                    </h2>

                                </div>


                                {matchBreakdown.matchingEvidence?.map(
                                    (item, index) => (

                                        <article
                                            key={index}
                                            className="evidence-card"
                                        >

                                            <div>

                                                <strong>
                                                    {item.requirement}
                                                </strong>

                                                <p>
                                                    {item.resumeEvidence}
                                                </p>

                                            </div>

                                            <span>
                                                {item.supportLevel}
                                            </span>

                                        </article>

                                    )
                                )}

                            </div>


                            {/* WEAK AREAS */}

                            <div className="insight-section">

                                <div className="insight-section__heading">

                                    <span>
                                        02
                                    </span>

                                    <h2>
                                        Missing / Weak Areas
                                    </h2>

                                </div>


                                {matchBreakdown.missingWeakAreas?.map(
                                    (item, index) => (

                                        <article
                                            key={index}
                                            className="evidence-card"
                                        >

                                            <div>

                                                <strong>
                                                    {item.requirement}
                                                </strong>

                                                <p>
                                                    {item.reason}
                                                </p>

                                            </div>

                                            <span>
                                                {item.supportLevel}
                                            </span>

                                        </article>

                                    )
                                )}

                            </div>


                            {/* WHY SCORE */}

                            <div className="ai-explanation">

                                <span>
                                    AI EXPLANATION
                                </span>

                                <h2>
                                    Why your score is {readiness}%
                                </h2>

                                <p>
                                    {matchBreakdown.whyNotHigher ||
                                        'Your score reflects the alignment between your profile and the target role.'}
                                </p>

                            </div>


                            {/* IMPORTANT REQUIREMENTS */}

                            <div className="insight-section">

                                <div className="insight-section__heading">

                                    <span>
                                        03
                                    </span>

                                    <h2>
                                        Important JD Requirements
                                    </h2>

                                </div>


                                {matchBreakdown.importantJdRequirements?.map(
                                    (item, index) => (

                                        <article
                                            key={index}
                                            className="evidence-card"
                                        >

                                            <div>

                                                <strong>
                                                    {item.requirement}
                                                </strong>

                                                <p>
                                                    {item.reason}
                                                </p>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>


                            {/* STRENGTHS */}

                            <div className="insight-section">

                                <div className="insight-section__heading">

                                    <span>
                                        04
                                    </span>

                                    <h2>
                                        Relevant Strengths
                                    </h2>

                                </div>


                                {matchBreakdown.relevantStrengths?.map(
                                    (item, index) => (

                                        <article
                                            key={index}
                                            className="evidence-card"
                                        >

                                            <div>

                                                <strong>
                                                    {item.strength}
                                                </strong>

                                                <p>
                                                    {item.resumeEvidence}
                                                </p>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>


                            {/* SUGGESTIONS */}

                            <div className="insight-section">

                                <div className="insight-section__heading">

                                    <span>
                                        05
                                    </span>

                                    <h2>
                                        Actionable Suggestions
                                    </h2>

                                </div>


                                {matchBreakdown.actionableSuggestions?.map(
                                    (item, index) => (

                                        <article
                                            key={index}
                                            className="evidence-card"
                                        >

                                            <div>

                                                <strong>
                                                    {item.suggestion}
                                                </strong>

                                                <p>
                                                    Related requirement:{" "}
                                                    {item.relatedRequirement}
                                                </p>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        </section>

                    )}

                </main>

            </div>

        </div>

    )

}


export default Interview