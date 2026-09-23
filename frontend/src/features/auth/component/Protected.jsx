import { useAuth } from "../hooks/useAuth";
import React from 'react';
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    console.log("Loading:", loading);
    console.log("User:", user);

    if (loading) {
        return <main><h1>Loading.....</h1></main>
    }
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children || <h1>Home Page</h1>
}

export default Protected