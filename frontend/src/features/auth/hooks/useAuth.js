
import { useContext, useEffect } from "react";

import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {  // ✅ Named export hai
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context
    

    const handlelogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            
        } catch (err) {
            // Error handle karo
        } finally {
            setLoading(false)
        }
    }

    const handleregister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({
                username,
                email,
                password
            })
            setUser(data.user)
             return data
            
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handlelogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
            
        } catch (err) {
            // Error handle karo
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
    const getAndSetUser = async () => {
        try {
            // console.log("1. getAndSetUser called")  // ✅ Add
            // setLoading(true)
            const data = await getMe()
            // console.log("2. getMe response:", data)  // ✅ Add
            setUser(data.user)
            // console.log("3. User set:", data.user)  // ✅ Add
        } catch (err) {
            // console.log("4. Error in getMe:", err)  // ✅ Add
            // setUser(null)
        } finally {
            // console.log("5. Setting loading to false")  // ✅ Add
            setLoading(false)
        }
    }

        getAndSetUser()
    }, [])

    return { user, loading, handlelogin, handlelogout, handleregister }
}