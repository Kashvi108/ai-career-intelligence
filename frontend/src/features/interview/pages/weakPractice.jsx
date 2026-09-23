import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useInterview } from "../hooks/useInterview.js"
import "./weakPractice.scss"

const WeakPractice = () => {

    const { weakPracticeId } = useParams()

    const {
        fetchWeakPractice,
        submitWeakPracticeAnswer,
        goToNextWeakPracticeQuestion,
        loading
    } = useInterview()

    const [practice, setPractice] = useState(null)
    const [answer, setAnswer] = useState("")
    const [evaluation, setEvaluation] = useState(null)


    useEffect(() => {

        const loadPractice = async () => {

            if (!weakPracticeId) return

            const data =
                await fetchWeakPractice(weakPracticeId)

            if (data) {
                setPractice(data)
            }
        }

        loadPractice()

    }, [weakPracticeId])


    const handleSubmitAnswer = async () => {

        if (!answer.trim()) {
            alert("Please write your answer first.")
            return
        }

        const response =
            await submitWeakPracticeAnswer(
                weakPracticeId,
                answer
            )

        if (!response) {
            return
        }

        setEvaluation(response.evaluation)

        setPractice(prev => ({
            ...prev,
            ...response.weakPractice
        }))
    }


    const handleNextQuestion = async () => {

        const updatedPractice =
            await goToNextWeakPracticeQuestion(
                weakPracticeId
            )

        if (!updatedPractice) {
            return
        }

        setPractice(updatedPractice)

        setEvaluation(null)
        setAnswer("")
    }


    if (loading || !practice) {

        return (
            <main className="weak-loading">

                <div className="weak-loading__core">
                    AI
                </div>

                <span>
                    WEAK AREA INTELLIGENCE
                </span>

                <h1>
                    Preparing your targeted practice
                </h1>

            </main>
        )
    }


    const currentIndex =
        practice.currentQuestionIndex || 0

    const totalQuestions =
        practice.questions?.length || 0

    const isCompleted =
        practice.status === "completed"


    const progress =
        totalQuestions
            ? Math.min(
                ((currentIndex + 1) /
                    totalQuestions) * 100,
                100
            )
            : 0


    if (isCompleted) {

        return (

            <main className="weak-page">

                <header className="weak-header">

                    <div className="weak-brand">

                        <div className="weak-brand__core">
                            AI
                        </div>

                        <div>
                            <span>
                                AI CAREER INTELLIGENCE
                            </span>

                            <strong>
                                Weak Area Practice
                            </strong>
                        </div>

                    </div>

                </header>


                <div className="weak-container">

                    <section className="weak-complete">

                        <div className="weak-complete__icon">
                            ✓
                        </div>

                        <span className="weak-eyebrow">
                            PRACTICE COMPLETE
                        </span>

                        <h1>
                            Weak areas,
                            <br />
                            challenged.
                        </h1>

                        <p>
                            Your targeted practice session has
                            been evaluated by the AI interviewer.
                        </p>


                        <div className="weak-score-card">

                            <span>
                                PRACTICE SCORE
                            </span>

                            <strong>
                                {practice.overallScore}
                                <small>/10</small>
                            </strong>

                            <p>
                                Targeted weak-area performance
                            </p>

                        </div>


                        <div className="weak-area-list">

                            <span>
                                AREAS PRACTICED
                            </span>

                            <div>

                                {practice.weakAreas?.map(
                                    (area, index) => (

                                        <span
                                            key={index}
                                            className="weak-area-tag"
                                        >
                                            {area}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>


                        <div className="weak-review">

                            <div className="weak-review__heading">

                                <span>
                                    PRACTICE INTELLIGENCE
                                </span>

                                <h2>
                                    Answer Review
                                </h2>

                            </div>


                            {practice.answers?.map(
                                (item, index) => (

                                    <article
                                        className="weak-review-card"
                                        key={index}
                                    >

                                        <div className="weak-review-card__top">

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

                                        <div>
                                            <span>
                                                YOUR ANSWER
                                            </span>

                                            <p>
                                                {item.answer}
                                            </p>
                                        </div>

                                        <div>
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

                    </section>

                </div>

            </main>
        )
    }


    return (

        <main className="weak-page">

            <header className="weak-header">

                <div className="weak-brand">

                    <div className="weak-brand__core">
                        AI
                    </div>

                    <div>
                        <span>
                            AI CAREER INTELLIGENCE
                        </span>

                        <strong>
                            Weak Area Practice
                        </strong>
                    </div>

                </div>

                <div className="weak-header__status">
                    <span />
                    TARGETED SESSION
                </div>

            </header>


            <div className="weak-container">

                <section className="weak-session">

                    <div className="weak-session__top">

                        <div>

                            <span className="weak-eyebrow">
                                TARGETED AI PRACTICE
                            </span>

                            <h1>
                                Strengthen your weak areas.
                            </h1>

                            <p>
                                These questions are generated
                                specifically from your previous
                                interview performance.
                            </p>

                        </div>


                        <div className="weak-counter">

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


                    <div className="weak-areas">

                        <span>
                            FOCUS AREAS
                        </span>

                        <div>

                            {practice.weakAreas?.map(
                                (area, index) => (

                                    <span
                                        key={index}
                                        className="weak-area-tag"
                                    >
                                        {area}
                                    </span>

                                )
                            )}

                        </div>

                    </div>


                    <div className="weak-progress">

                        <div>

                            <span>
                                PRACTICE PROGRESS
                            </span>

                            <strong>
                                {Math.round(progress)}%
                            </strong>

                        </div>

                        <div className="weak-progress__track">

                            <div
                                className="weak-progress__fill"
                                style={{
                                    width: `${progress}%`
                                }}
                            />

                        </div>

                    </div>


                    <div className="weak-question-card">

                        <div className="weak-question-card__label">

                            <span />

                            AI TARGETED QUESTION

                        </div>

                        <h2>
                            {practice.questions[currentIndex]}
                        </h2>

                    </div>


                    <div className="weak-answer-card">

                        <div className="weak-answer-card__heading">

                            <div>

                                <span>
                                    YOUR RESPONSE
                                </span>

                                <strong>
                                    Focus on the weak area.
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


                        <div className="weak-answer-card__footer">

                            <span>
                                {answer.length} characters
                            </span>

                            {!evaluation && (

                                <button
                                    className="weak-submit"
                                    onClick={handleSubmitAnswer}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Evaluating..."
                                        : "Submit Answer →"
                                    }
                                </button>

                            )}

                        </div>

                    </div>


                    {evaluation && (

                        <div className="weak-evaluation">

                            <div className="weak-evaluation__header">

                                <div>

                                    <span>
                                        AI PERFORMANCE ANALYSIS
                                    </span>

                                    <h2>
                                        Response evaluated
                                    </h2>

                                </div>

                                <div>
                                    {evaluation.score}
                                    <small>/10</small>
                                </div>

                            </div>


                            <div className="weak-feedback">

                                <span>
                                    FEEDBACK
                                </span>

                                <p>
                                    {evaluation.feedback}
                                </p>

                            </div>


                            <div className="weak-columns">

                                <div>

                                    <span>
                                        STRENGTHS
                                    </span>

                                    <ul>
                                        {evaluation.strengths?.map(
                                            (item, index) => (
                                                <li key={index}>
                                                    {item}
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
                                        {evaluation.improvements?.map(
                                            (item, index) => (
                                                <li key={index}>
                                                    {item}
                                                </li>
                                            )
                                        )}
                                    </ul>

                                </div>

                            </div>


                            <div className="weak-next">

                                <button
                                    onClick={handleNextQuestion}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Loading..."
                                        : currentIndex === totalQuestions - 1
                                            ? "Finish Practice →"
                                            : "Next Question →"
                                    }
                                </button>

                            </div>

                        </div>

                    )}

                </section>

            </div>

        </main>
    )
}

export default WeakPractice