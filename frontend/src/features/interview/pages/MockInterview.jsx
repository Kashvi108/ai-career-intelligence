import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useInterview } from "../hooks/useInterview.js"
import "./mockInterview.scss"

const MockInterview = () => {

    const { mockInterviewId } = useParams()
    const navigate = useNavigate()

    const {
        fetchMockInterview,
        submitMockAnswerForInterview,
        goToNextMockQuestion,
        startWeakPracticeSession,
        loading
    } = useInterview()

    const [mockInterview, setMockInterview] = useState(null)
    const [answer, setAnswer] = useState("")
    const [evaluation, setEvaluation] = useState(null)

    useEffect(() => {

        const loadMockInterview = async () => {

            if (!mockInterviewId) return

            const data =
                await fetchMockInterview(mockInterviewId)

            if (data) {
                setMockInterview(data)
            }
        }

        loadMockInterview()

    }, [mockInterviewId])


    const handleSubmitAnswer = async () => {

        if (!answer.trim()) {
            alert("Please write your answer first.")
            return
        }

        const response =
            await submitMockAnswerForInterview(
                mockInterviewId,
                answer
            )

        if (!response) {
            return
        }

        setEvaluation(response.evaluation)

        setMockInterview(prev => ({
            ...prev,
            ...response.mockInterview
        }))
    }


    const handleNextQuestion = async () => {
    const updatedInterview =
        await goToNextMockQuestion(mockInterviewId)

    if (!updatedInterview) {
        return
    }

    setMockInterview(updatedInterview)

    if (updatedInterview.status === "completed") {
        setEvaluation(null)
        setAnswer("")
        return
    }

    setEvaluation(null)
    setAnswer("")
}

const handleStartWeakPractice = async () => {

    const weakPractice =
        await startWeakPracticeSession(mockInterviewId)

    if (!weakPractice) {
        return
    }

    console.log(
        "✅ Weak Practice Started:",
        weakPractice
    )

    navigate(
        `/weak-practice/${weakPractice._id}`
    )
}


    if (loading || !mockInterview) {

        return (
            <main className="mock-loading">

                <div className="mock-loading__core">
                    <span>AI</span>
                </div>

                <span className="mock-loading__label">
                    AI MOCK INTERVIEW
                </span>

                <h1>
                    Evaluating your answer
                </h1>

            </main>
        )
    }


    const currentIndex = mockInterview?.currentQuestionIndex || 0

    const totalQuestions =
        mockInterview?.questions?.length || 0

    const isCompleted =
        mockInterview.status === "completed"

        console.log("STATUS:", mockInterview?.status)
        console.log("IS COMPLETED:", isCompleted)
        console.log("MOCK INTERVIEW:", mockInterview)


    const progress =
        Math.min(
            ((currentIndex + 1) / totalQuestions) * 100,
            100
        )


    return (

        <main className="mock-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="mock-header">

                <div className="mock-brand">

                    <div className="mock-brand__core">
                        AI
                    </div>

                    <div>
                        <span>
                            AI CAREER INTELLIGENCE
                        </span>

                        <strong>
                            Mock Interview
                        </strong>
                    </div>

                </div>

                <div className="mock-header__status">

                    <span className="mock-status-dot" />

                    LIVE SESSION

                </div>

            </header>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="mock-container">

                {isCompleted ? (

                    /* =================================================
                       COMPLETED
                    ================================================= */

                    <section className="mock-complete">

                        <div className="completion-core">
                            <span>✓</span>
                        </div>

                        <span className="mock-eyebrow">
                            INTERVIEW COMPLETE
                        </span>

                        <h1>
                            Your Mock Interview
                            <br />
                            is complete.
                        </h1>

                        <p className="mock-complete__intro">
                            Your responses have been evaluated by the
                            AI interviewer. Review your performance below.
                        </p>


                        {/* SCORE */}

                        <div className="mock-score-card">

                            <span>
                                OVERALL SCORE
                            </span>

                            <strong>
                                {mockInterview.overallScore}
                                <small>/10</small>
                            </strong>

                            <p>
                                Overall interview performance
                            </p>

                        </div>



                        {/* AI PERFORMANCE SUMMARY */}

<div className="mock-summary-card">

    <div className="mock-summary-card__header">
        <div>
            <span>AI PERFORMANCE INTELLIGENCE</span>

            <h2>
                Interview Summary
            </h2>
        </div>

        <div className="mock-summary-card__icon">
            ✦
        </div>
    </div>

    <p>
        {mockInterview.summary ||
            "Your interview performance has been analyzed by the AI interviewer."}
    </p>

</div>


                        {/* STATS */}

                        <div className="mock-stats">

                            <div className="mock-stat">

                                <span>
                                    QUESTIONS
                                </span>

                                <strong>
                                    {mockInterview.answers.length}
                                </strong>

                                <small>
                                    completed
                                </small>

                            </div>


                            <div className="mock-stat">

                                <span>
                                    AVERAGE SCORE
                                </span>

                                <strong>
                                    {mockInterview.overallScore}
                                </strong>

                                <small>
                                    out of 10
                                </small>

                            </div>

                        </div>


                        {/* WEAK AREA PRACTICE */}

<div className="weak-practice-card">

    <div className="weak-practice-card__content">

        <span>
            AI-GUIDED PRACTICE
        </span>

        <h2>
            Strengthen your weak areas.
        </h2>

        <p>
            Your AI interviewer identified the areas where
            you can improve. Practice targeted questions
            designed specifically around your performance.
        </p>

    </div>

    <button
        className="weak-practice-button"
        onClick={handleStartWeakPractice}
    >
        Practice Weak Areas →
    </button>

</div>


                        {/* ANSWER REVIEW */}

                        <div className="review-section">

                            <div className="review-heading">

                                <div>
                                    <span>
                                        PERFORMANCE INTELLIGENCE
                                    </span>

                                    <h2>
                                        Answer Review
                                    </h2>
                                </div>

                                <small>
                                    {mockInterview.answers.length} RESPONSES
                                </small>

                            </div>


                            <div className="review-list">

                                {mockInterview.answers.map(
                                    (item, index) => (

                                        <article
                                            key={index}
                                            className="review-card"
                                        >

                                            <div className="review-card__top">

                                                <span>
                                                    QUESTION {String(index + 1).padStart(2, "0")}
                                                </span>

                                                <strong>
                                                    {item.score}/10
                                                </strong>

                                            </div>


                                            <h3>
                                                {item.question}
                                            </h3>


                                            <div className="review-answer">

                                                <span>
                                                    YOUR ANSWER
                                                </span>

                                                <p>
                                                    {item.answer}
                                                </p>

                                            </div>


                                            <div className="review-feedback">

                                                <span>
                                                    AI FEEDBACK
                                                </span>

                                                <p>
                                                    {item.feedback}
                                                </p>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        </div>

                    </section>

                ) : (

                    /* =================================================
                       ACTIVE INTERVIEW
                    ================================================= */

                    <section className="mock-session">

                        {/* SESSION INTRO */}

                        <div className="mock-session__top">

                            <div>

                                <span className="mock-eyebrow">
                                    AI MOCK INTERVIEW
                                </span>

                                <h1>
                                    Show what you know.
                                </h1>

                                <p>
                                    Answer naturally. Your response will be
                                    evaluated by the AI interviewer.
                                </p>

                            </div>


                            <div className="question-counter">

                                <span>
                                    QUESTION
                                </span>

                                <strong>
                                    {String(
                                        Math.min(
                                            currentIndex + 1,
                                            totalQuestions
                                        )
                                    ).padStart(2, "0")}
                                </strong>

                                <small>
                                    / {String(totalQuestions).padStart(2, "0")}
                                </small>

                            </div>

                        </div>


                        {/* PROGRESS */}

                        <div className="mock-progress">

                            <div className="mock-progress__top">

                                <span>
                                    INTERVIEW PROGRESS
                                </span>

                                <strong>
                                    {Math.round(progress)}%
                                </strong>

                            </div>

                            <div className="mock-progress__track">

                                <div
                                    className="mock-progress__fill"
                                    style={{
                                        width: `${progress}%`
                                    }}
                                />

                            </div>

                        </div>


                        {/* QUESTION */}

                        <div className="mock-question-card">

                            <div className="mock-question-card__label">

                                <span className="ai-pulse" />

                                AI INTERVIEWER

                            </div>

                            <h2>
                                {mockInterview.questions[currentIndex]}
                            </h2>

                        </div>


                        {/* ANSWER */}

                        <div className="mock-answer-card">

                            <div className="mock-answer-card__heading">

                                <div>

                                    <span>
                                        YOUR RESPONSE
                                    </span>

                                    <strong>
                                        Take your time.
                                    </strong>

                                </div>

                                <small>
                                    AI EVALUATED
                                </small>

                            </div>


                            <textarea
                                value={answer}
                                onChange={(e) =>
                                    setAnswer(e.target.value)
                                }
                                placeholder="Type your answer here..."
                                rows={8}
                            />


                            <div className="mock-answer-card__footer">

                                <span>
                                    {answer.length} characters
                                </span>

                                <button
                                    className="mock-submit"
                                    onClick={handleSubmitAnswer}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Evaluating..."
                                        : "Submit Answer →"
                                    }
                                </button>

                            </div>

                        </div>


                        {/* EVALUATION */}

                        {evaluation && (

                            <div className="evaluation-card">

                                <div className="evaluation-card__header">

                                    <div>

                                        <span>
                                            AI PERFORMANCE ANALYSIS
                                        </span>

                                        <h2>
                                            Response evaluated
                                        </h2>

                                    </div>

                                    <div className="evaluation-score">
                                        {evaluation.score}
                                        <small>/10</small>
                                    </div>

                                </div>


                                <div className="evaluation-feedback">

                                    <span>
                                        FEEDBACK
                                    </span>

                                    <p>
                                        {evaluation.feedback}
                                    </p>

                                </div>


                                <div className="evaluation-columns">

                                    <div>

                                        <span>
                                            STRENGTHS
                                        </span>

                                        <ul>
                                            {evaluation.strengths.map(
                                                (strength, index) => (
                                                    <li key={index}>
                                                        {strength}
                                                    </li>
                                                )
                                            )}
                                        </ul>

                                    </div>


                                    <div>

                                        <span>
                                            AREAS TO IMPROVE
                                        </span>

                                        <ul>
                                            {evaluation.improvements.map(
                                                (improvement, index) => (
                                                    <li key={index}>
                                                        {improvement}
                                                    </li>
                                                )
                                            )}
                                        </ul>

                                    </div>

                                </div>


                                <div className="evaluation-next">

                                    <button
                                        className="mock-next"
                                        onClick={handleNextQuestion}
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Loading..."
                                            : currentIndex === totalQuestions - 1
                                                ? "Finish Interview →"
                                                : "Next Question →"
                                        }
                                    </button>

                                </div>

                            </div>

                        )}

                    </section>

                )}

            </div>

        </main>
    )
}

export default MockInterview