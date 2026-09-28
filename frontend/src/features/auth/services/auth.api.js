import axios from "axios"

const api = axios.create({
    baseURL: "https://ai-career-intelligence-hazel.vercel.app",
    withCredentials: true
})

export async function register({ username, email, password }) {
    try {
        console.log("Register called with:", { username, email, password });
        const response = await api.post('/api/auth/register', {
            username, email, password
        })
        console.log("Register response:", response.data);
        return response.data
    } catch (err) {
        console.log("Register error:", err.response?.data || err.message);
        throw err;
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post('/api/auth/login', {
            email, password
        })
        return response.data
    } catch (err) {
        console.log(err)  
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")
        return response.data
    } catch (err) {
        console.log(err)  
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me")
        return response.data
    } catch (err) {
        console.log(err)  
    }
}