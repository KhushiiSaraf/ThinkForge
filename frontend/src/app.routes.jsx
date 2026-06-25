import {createBrowserRouter} from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
// import Home from './features/interview/pages/Home'
// import Interview from './features/interview/pages/Interview'
// import Landing from './pages/Landing'
// import NotFound from './pages/NotFound'
import Protected from './features/auth/components/Protected'
import PublicRoute from './features/auth/components/PublicRoute'

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <PublicRoute><Login /></PublicRoute>
    },
    {
        path: "/register",
        element: <PublicRoute><Register /></PublicRoute>
    },   
    {
        path: "/",
        element: <PublicRoute><h1>hi /</h1></PublicRoute>
    },
    {
        path: "/dashboard",
        element: <Protected><h1>hi dashboard</h1></Protected>
    },
    // {
    //     path: "/interview/:interviewId",
    //     element: <Protected><Interview /></Protected>
    // },
    // {
    // path: "*",
    // element: <NotFound />
    // }
]);