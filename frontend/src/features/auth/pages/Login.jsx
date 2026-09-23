
import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { motion } from "framer-motion"
import "./Login.scss"

const Login = () => {

    const { loading, handlelogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})

    const validate = () => {

        const newErrors = {}

        if (!email) {
            newErrors.email = "Email is required"
        }

        if (!password) {
            newErrors.password = "Password is required"
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!validate()) return

        await handlelogin({
            email,
            password
        })

        navigate("/home")
    }

    if (loading) {

        return (
            <main className="auth-loading">

                <div className="auth-loading__core">
                    <span />
                    <span />
                    <span />
                </div>

                <span>AI CAREER INTELLIGENCE</span>

                <h1>Authenticating your workspace...</h1>

            </main>
        )
    }

    return (

        <motion.main
            className="auth-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >

            <div className="auth-grain" />

            <div className="auth-background">
                <div className="auth-orbit auth-orbit--one" />
                <div className="auth-orbit auth-orbit--two" />
                <div className="auth-glow" />
            </div>


            {/* Top Navigation */}

            <header className="auth-header">

                <button
                    className="auth-brand"
                    onClick={() => navigate("/")}
                >

                    <span className="auth-brand__core">
                        AI
                    </span>

                    <span>
                        AI CAREER
                        <strong>INTELLIGENCE</strong>
                    </span>

                </button>


                <button
                    className="auth-home-button"
                    onClick={() => navigate("/")}
                >
                    ← Go to Home
                </button>

            </header>


            {/* Main Content */}

            <section className="auth-layout">


                {/* Intelligence Panel */}

                <motion.div
                    className="auth-intelligence"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >

                    <span className="auth-eyebrow">
                        AI CAREER INTELLIGENCE
                    </span>

                    <h1>
                        Your career.
                        <br />
                        <span>Understood by AI.</span>
                    </h1>

                    <p>
                        Continue your personalized interview
                        preparation and access your career
                        intelligence workspace.
                    </p>


                    <div className="auth-brain">

                        <div className="auth-brain__ring auth-brain__ring--one" />
                        <div className="auth-brain__ring auth-brain__ring--two" />

                        <span className="auth-node auth-node--one">
                            RESUME
                        </span>

                        <span className="auth-node auth-node--two">
                            SKILLS
                        </span>

                        <span className="auth-node auth-node--three">
                            ROLE
                        </span>

                        <div className="auth-brain__core">
                            AI
                        </div>

                    </div>


                    <div className="auth-trust">

                        <span>✓ Resume Intelligence</span>
                        <span>✓ AI Mock Interviews</span>
                        <span>✓ Personalized Roadmaps</span>

                    </div>

                </motion.div>


                {/* Login Card */}

                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.55,
                        delay: 0.1
                    }}
                >

                    <div className="auth-card__header">

                        <span>
                            SECURE ACCESS
                        </span>

                        <h2>
                            Welcome back.
                        </h2>

                        <p>
                            Sign in to continue your
                            interview intelligence.
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* Email */}

                        <div className="auth-field">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {

                                    setEmail(e.target.value)

                                    if (errors.email) {
                                        setErrors({
                                            ...errors,
                                            email: ""
                                        })
                                    }

                                }}
                                className={
                                    errors.email
                                        ? "auth-input auth-input--error"
                                        : "auth-input"
                                }
                            />

                            {errors.email && (
                                <span className="auth-error">
                                    {errors.email}
                                </span>
                            )}

                        </div>


                        {/* Password */}

                        <div className="auth-field">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {

                                    setPassword(e.target.value)

                                    if (errors.password) {
                                        setErrors({
                                            ...errors,
                                            password: ""
                                        })
                                    }

                                }}
                                className={
                                    errors.password
                                        ? "auth-input auth-input--error"
                                        : "auth-input"
                                }
                            />

                            {errors.password && (
                                <span className="auth-error">
                                    {errors.password}
                                </span>
                            )}

                        </div>


                        <motion.button
                            type="submit"
                            className="auth-submit"
                            whileHover={{
                                y: -2
                            }}
                            whileTap={{
                                scale: 0.98
                            }}
                            disabled={loading}
                        >

                            {loading
                                ? "Authenticating..."
                                : "Enter AI Workspace →"
                            }

                        </motion.button>

                    </form>


                    <div className="auth-card__footer">

                        <span>
                            New to the AI Brain?
                        </span>

                        <Link to="/register">
                            Create an account
                        </Link>

                    </div>

                </motion.div>

            </section>

        </motion.main>
    )
}

export default Login
