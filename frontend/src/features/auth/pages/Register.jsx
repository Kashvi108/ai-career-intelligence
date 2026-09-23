import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { motion } from "framer-motion"
import "./Register.scss"

const Register = () => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})

    const { loading, handleregister } = useAuth()
    const navigate = useNavigate()

    const validate = () => {

        const newErrors = {}

        if (!username) {
            newErrors.username = "Username is required"
        }

        if (!email) {
            newErrors.email = "Email is required"
        }

        if (!password) {
            newErrors.password = "Password is required"
        }

        if (password.length > 0 && password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters"
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!validate()) return

        await handleregister({
            username,
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

                <h1>
                    Creating your workspace...
                </h1>

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


            {/* Header */}

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


            {/* Main */}

            <section className="auth-layout">


                {/* Intelligence Panel */}

                <motion.div
                    className="auth-intelligence"
                    initial={{
                        opacity: 0,
                        x: -30
                    }}
                    animate={{
                        opacity: 1,
                        x: 0
                    }}
                    transition={{
                        duration: 0.6
                    }}
                >

                    <span className="auth-eyebrow">
                        BUILD YOUR CAREER INTELLIGENCE
                    </span>

                    <h1>
                        Start your journey.
                        <br />
                        <span>Powered by AI.</span>
                    </h1>

                    <p>
                        Create your workspace and turn your
                        resume, skills and interview preparation
                        into one intelligent career system.
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
                            INTERVIEW
                        </span>

                        <div className="auth-brain__core">
                            AI
                        </div>

                    </div>


                    <div className="auth-trust">

                        <span>
                            ✓ Resume Intelligence
                        </span>

                        <span>
                            ✓ Skill Gap Analysis
                        </span>

                        <span>
                            ✓ AI Mock Interviews
                        </span>

                    </div>

                </motion.div>


                {/* Register Card */}

                <motion.div
                    className="auth-card"
                    initial={{
                        opacity: 0,
                        y: 25
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.55,
                        delay: 0.1
                    }}
                >

                    <div className="auth-card__header">

                        <span>
                            CREATE WORKSPACE
                        </span>

                        <h2>
                            Build your profile.
                        </h2>

                        <p>
                            Create an account to start your
                            personalized AI preparation.
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >


                        {/* Username */}

                        <div className="auth-field">

                            <label>
                                Username
                            </label>

                            <input
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => {

                                    setUsername(e.target.value)

                                    if (errors.username) {
                                        setErrors({
                                            ...errors,
                                            username: ""
                                        })
                                    }

                                }}
                                className={
                                    errors.username
                                        ? "auth-input auth-input--error"
                                        : "auth-input"
                                }
                            />

                            {errors.username && (
                                <span className="auth-error">
                                    {errors.username}
                                </span>
                            )}

                        </div>


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
                                placeholder="Minimum 6 characters"
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


                        {/* Submit */}

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
                                ? "Creating workspace..."
                                : "Create AI Workspace →"
                            }

                        </motion.button>

                    </form>


                    {/* Footer */}

                    <div className="auth-card__footer">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Sign in
                        </Link>

                    </div>

                </motion.div>

            </section>

        </motion.main>
    )
}

export default Register

