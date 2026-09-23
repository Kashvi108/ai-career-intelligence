import { createBrowserRouter } from "react-router-dom";
import Landing from "./features/auth/pages/Landing"
import Protected from "./features/auth/component/protected";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register"; 
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import MockInterview from "./features/interview/pages/MockInterview"
import WeakPractice from "./features/interview/pages/WeakPractice"


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,  
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/home",
        element: <Protected>< Home /></Protected> 
    },
    {
        path:"/interview/:interviewId",
        element:<Protected><Interview/> </Protected>
    },
    {
    path: "/mock-interview/:mockInterviewId",
    element: (
        <Protected>
            <MockInterview />
        </Protected>
    )
},

{
    path: "/weak-practice/:weakPracticeId",
    element: (
        <Protected>
            <WeakPractice />
        </Protected>
    )
}
])