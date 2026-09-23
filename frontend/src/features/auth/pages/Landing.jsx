import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import "./Landing.scss"


const ICON_PATHS = {

    target: (
        <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1" />
        </>
    ),

    chat: (
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    ),

    chart: (
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    ),

    refresh: (
        <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    ),

    doc: (
        <>
            <path d="M6 2h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
            <path d="M14 2v4h4" />
            <path d="M8 12h8M8 16h8" />
        </>
    ),

    mic: (
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
    ),

    trend: (
        <path d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6" />
    ),

    jd: (
        <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M7 8h10M7 12h10M7 16h6" />
        </>
    ),

    plus: (
        <path d="M12 5v14M5 12h14" />
    ),
}


const Icon = ({ name, className }) => (

    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {ICON_PATHS[name]}
    </svg>

)


const features = [

    [
        "target",
        "Role Intelligence",
        "Understand exactly what the job demands and map your profile against the role."
    ],

    [
        "doc",
        "Resume Intelligence",
        "Extract your strongest signals, experience, skills, and potential weak points from your resume."
    ],

    [
        "mic",
        "Interview Intelligence",
        "Practice realistic technical and behavioral interviews generated around your target role."
    ],

    [
        "trend",
        "Performance Intelligence",
        "Turn every interview attempt into measurable insights, gaps, and your next improvement target."
    ],

]


const process = [

    [
        "doc",
        "INPUT",
        "Feed the system your resume and target job description. Your career data becomes the foundation."
    ],

    [
        "mic",
        "THINK",
        "AI connects your experience, skills, role requirements, and interview performance into one intelligence map."
    ],

    [
        "trend",
        "ADAPT",
        "Every practice session updates the picture and tells you exactly what deserves your attention next."
    ],

]


const faqs = [

    [
        "Do I need to upload my resume?",
        "It's optional, but recommended — it lets the AI tailor questions to your actual background instead of generic ones."
    ],

    [
        "Can it prepare me for behavioral interviews?",
        "Yes. You can practice both technical and behavioral formats, and mix them within the same session."
    ],

    [
        "What feedback do I get after practice?",
        "A scorecard covering clarity, structure, and confidence, plus specific notes on what to fix next."
    ],

    [
        "Is this only for technical roles?",
        "No — the question bank adapts to whatever role and job description you provide."
    ],

]


const FaqItem = ({ q, a, isOpen, onToggle }) => {

    const answerRef = useRef(null)

    return (

        <div className={`faq-item${isOpen ? " open" : ""}`}>

            <button
                className="faq-q"
                onClick={onToggle}
            >
                {q}

                <Icon
                    name="plus"
                    className="faq-icon"
                />

            </button>

            <div
                className="faq-a"
                ref={answerRef}
                style={{
                    maxHeight:
                        isOpen && answerRef.current
                            ? answerRef.current.scrollHeight
                            : 0
                }}
            >
                <p>{a}</p>
            </div>

        </div>

    )
}


const Landing = () => {

    const { user } = useAuth()

    const revealRefs = useRef([])

    const [openFaq, setOpenFaq] = useState(null)

    const [mobileMenu, setMobileMenu] = useState(false)

    revealRefs.current = []

    const addRevealRef = (el) => {

        if (
            el &&
            !revealRefs.current.includes(el)
        ) {
            revealRefs.current.push(el)
        }

    }


    useEffect(() => {

        const io = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view")
                    }

                })

            },

            {
                threshold: 0.15
            }

        )


        revealRefs.current.forEach((el) => {
            io.observe(el)
        })


        return () => {
            io.disconnect()
        }

    }, [])


    const closeMobileMenu = () => {
        setMobileMenu(false)
    }


    return (

        <div className="landing-container">

            <div className="mesh">
                <span />
            </div>

            <div className="grain" />


            {/* NAVBAR */}

            <nav className="landing-nav">

                <div className="nav-content">


                    {/* Brand */}

                    <Link
                        to="/"
                        className="logo"
                        onClick={closeMobileMenu}
                    >

                        <span className="logo-mark">
                            AI
                        </span>

                        <span className="logo-text">
                            AI CAREER
                            <strong>INTELLIGENCE</strong>
                        </span>

                    </Link>


                    {/* Desktop Links */}

                    <div
                        className={`nav-links ${
                            mobileMenu
                                ? "nav-links--open"
                                : ""
                        }`}
                    >

                        <a
                            href="#features"
                            className="nav-link"
                            onClick={closeMobileMenu}
                        >
                            Features
                        </a>

                        <a
                            href="#process"
                            className="nav-link"
                            onClick={closeMobileMenu}
                        >
                            How it works
                        </a>

                        <a
                            href="#faq"
                            className="nav-link"
                            onClick={closeMobileMenu}
                        >
                            FAQ
                        </a>

                        <span className="nav-divider" />

                        <span className="nav-status">

                            <span className="nav-status-dot" />

                            SYSTEM ONLINE

                        </span>

                    </div>


                    {/* CTA */}

                    <div className="nav-cta">

                        {user ? (

                            <Link
                                to="/login"
                                className="btn btn-primary"
                            >
                                Open Workspace →
                            </Link>

                        ) : (

                            <>

                                <Link
                                    to="/login"
                                    className="btn btn-outline"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="btn btn-primary"
                                >
                                    Get Started
                                </Link>

                            </>

                        )}

                    </div>


                    {/* Mobile Menu */}

                    <button
                        className={`mobile-menu-button ${
                            mobileMenu
                                ? "mobile-menu-button--open"
                                : ""
                        }`}
                        onClick={() =>
                            setMobileMenu(!mobileMenu)
                        }
                        aria-label="Toggle navigation"
                    >

                        <span />
                        <span />
                        <span />

                    </button>

                </div>

            </nav>


            {/* HERO */}

            <section className="hero">


                <div className="hero-copy">

                    <div className="eyebrow">

                        <span className="eyebrow-dot" />

                        AI CAREER INTELLIGENCE

                    </div>


                    <h1>

                        Your career.

                        <br />

                        <span className="accent">
                            Understood by AI.
                        </span>

                    </h1>


                    <p className="hero-desc">

                        Turn your resume, job description,
                        skills, and interview performance into
                        one intelligent career map — and know
                        exactly what to improve before your
                        next interview.

                    </p>


                    <div className="hero-buttons">

                        <Link
                            to="/register"
                            className="btn btn-primary btn-large"
                        >
                            Build Your AI Profile →
                        </Link>

                        <a
                            href="#process"
                            className="btn btn-outline btn-large"
                        >
                            Explore the system
                        </a>

                    </div>


                    <div className="hero-trust">

                        <span className="trust-dot" />

                        <span>
                            Resume analysis
                        </span>

                        <span className="trust-separator">
                            •
                        </span>

                        <span>
                            Role matching
                        </span>

                        <span className="trust-separator">
                            •
                        </span>

                        <span>
                            AI mock interviews
                        </span>

                    </div>

                </div>


                {/* AI BRAIN */}

                <div className="brain-panel">

                    <div className="brain-panel-head">

                        <div>

                            <span className="brain-status">

                                <span className="brain-status-dot" />

                                AI CAREER INTELLIGENCE

                            </span>

                            <h3>
                                Career Brain
                            </h3>

                        </div>

                        <span className="brain-live">
                            LIVE
                        </span>

                    </div>


                    <div className="brain-visual">

                        <div className="brain-grid" />

                        <div className="brain-ring ring-one" />
                        <div className="brain-ring ring-two" />
                        <div className="brain-ring ring-three" />


                        <span className="brain-line line-one" />
                        <span className="brain-line line-two" />
                        <span className="brain-line line-three" />
                        <span className="brain-line line-four" />
                        <span className="brain-line line-five" />


                        <div className="brain-node node-react">
                            <span>React</span>
                        </div>

                        <div className="brain-node node-js">
                            <span>JavaScript</span>
                        </div>

                        <div className="brain-node node-node">
                            <span>Node.js</span>
                        </div>

                        <div className="brain-node node-behavioral">
                            <span>Behavioral</span>
                        </div>

                        <div className="brain-node node-resume">
                            <span>Resume</span>
                        </div>


                        {/* Additional unique nodes */}

                        <div className="brain-node node-role">
                            <span>Target Role</span>
                        </div>

                        <div className="brain-node node-skills">
                            <span>Skills</span>
                        </div>


                        <div className="brain-core">

                            <div className="brain-core-inner">

                                <span>AI</span>

                                <small>
                                    CORE
                                </small>

                            </div>

                        </div>


                        <div className="brain-pulse pulse-one" />
                        <div className="brain-pulse pulse-two" />

                    </div>


                    <div className="brain-metrics">

                        <div className="brain-metric">

                            <span>
                                Readiness
                            </span>

                            <strong>
                                92%
                            </strong>

                        </div>


                        <div className="brain-metric">

                            <span>
                                Skill Match
                            </span>

                            <strong>
                                87%
                            </strong>

                        </div>


                        <div className="brain-metric">

                            <span>
                                Signals
                            </span>

                            <strong>
                                12
                            </strong>

                        </div>

                    </div>


                    <div className="brain-insight">

                        <span className="brain-insight-icon">
                            ✦
                        </span>

                        <p>

                            <b>AI Insight:</b>

                            Your career signals are connected.
                            Build your profile to discover where
                            your preparation should focus next.

                        </p>

                    </div>

                </div>

            </section>


            {/* FEATURES */}

            <section
                className="section"
                id="features"
            >

                <div className="section-head">

                    <span
                        className="section-eyebrow reveal"
                        ref={addRevealRef}
                    >
                        THE AI BRAIN
                    </span>


                    <h2
                        className="reveal"
                        ref={addRevealRef}
                    >
                        One system. Your entire interview intelligence.
                    </h2>


                    <p
                        className="section-sub reveal"
                        ref={addRevealRef}
                    >
                        Every part of your preparation feeds the same
                        intelligence layer, so your practice gets
                        smarter with every session.
                    </p>

                </div>


                <div className="feature-grid">

                    {features.map(
                        ([icon, title, desc]) => (

                            <div
                                className="feature-card reveal"
                                ref={addRevealRef}
                                key={title}
                            >

                                <div className="feature-icon">

                                    <Icon name={icon} />

                                    <span className="feature-pulse" />

                                </div>

                                <h3>
                                    {title}
                                </h3>

                                <p>
                                    {desc}
                                </p>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* PROCESS */}

            <section
                className="section"
                id="process"
            >

                <div className="section-head">

                    <span
                        className="section-eyebrow reveal"
                        ref={addRevealRef}
                    >
                        HOW THE INTELLIGENCE WORKS
                    </span>


                    <h2
                        className="reveal"
                        ref={addRevealRef}
                    >
                        Your preparation becomes a learning system.
                    </h2>


                    <p
                        className="section-sub reveal"
                        ref={addRevealRef}
                    >
                        Input your career data, let the AI connect
                        the signals, then use every interview to make
                        the next one smarter.
                    </p>

                </div>


                <div className="process-grid">

                    {process.map(
                        ([icon, title, desc], i) => (

                            <div
                                className="process-card reveal"
                                ref={addRevealRef}
                                key={title}
                            >

                                <div className="process-num">
                                    {String(i + 1).padStart(2, "0")}
                                </div>


                                <div className="process-status">

                                    <span />

                                    ACTIVE MODULE

                                </div>


                                <h3>
                                    {title}
                                </h3>


                                <p>
                                    {desc}
                                </p>


                                {i < process.length - 1 && (
                                    <div className="process-connector" />
                                )}

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* FAQ */}

            <section
                className="section"
                id="faq"
            >

                <div className="section-head">

                    <span
                        className="section-eyebrow reveal"
                        ref={addRevealRef}
                    >
                        SYSTEM QUESTIONS
                    </span>


                    <h2
                        className="reveal"
                        ref={addRevealRef}
                    >
                        Before you enter the AI Brain
                    </h2>


                    <p
                        className="section-sub reveal"
                        ref={addRevealRef}
                    >
                        A few things you should know before your
                        first intelligence session.
                    </p>

                </div>


                <div className="faq-list">

                    {faqs.map(
                        ([q, a], i) => (

                            <div
                                className="reveal"
                                ref={addRevealRef}
                                key={q}
                            >

                                <FaqItem
                                    q={q}
                                    a={a}
                                    isOpen={openFaq === i}
                                    onToggle={() =>
                                        setOpenFaq(
                                            openFaq === i
                                                ? null
                                                : i
                                        )
                                    }
                                />

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* CTA */}

            <section className="section">

                <div
                    className="cta-box reveal"
                    ref={addRevealRef}
                >

                    <div className="cta-orbit">

                        <span />
                        <span />
                        <span />

                    </div>


                    <div className="cta-eyebrow">

                        <span />

                        YOUR NEXT INTERVIEW STARTS HERE

                    </div>


                    <h2>

                        Turn preparation into

                        <span>
                            intelligence.
                        </span>

                    </h2>


                    <p>

                        Build your AI career profile,
                        understand your gaps, and walk into
                        every interview with a clearer strategy.

                    </p>


                    <div className="cta-buttons">

                        <Link
                            to="/register"
                            className="btn btn-primary btn-large"
                        >
                            Start Practicing →
                        </Link>

                        <a
                            href="#features"
                            className="btn btn-outline btn-large"
                        >
                            See features
                        </a>

                    </div>

                </div>

            </section>


            <footer>

                <div>
                    © 2026 AI Career Intelligence.
                    All rights reserved.
                </div>

                <div className="footer-status">

                    <span />

                    SYSTEM ONLINE

                </div>

            </footer>

        </div>

    )
}


export default Landing

