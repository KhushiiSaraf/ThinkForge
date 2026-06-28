import {createBrowserRouter} from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import LandingPage from './pages/LandingPage'
import Dashboard from './features/notes/pages/Dashboard'
import NoteEditor from './features/notes/pages/NoteEditor'
// import Home from './features/interview/pages/Home'
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
        element: <PublicRoute><LandingPage/></PublicRoute>
    },
    {
        path: "/dashboard",
        element: <Protected><Dashboard/></Protected>
    },
    {
        path: "/notes/:id",
        element: <Protected><NoteEditor /></Protected>
    },
    // {
    // path: "*",
    // element: <NotFound />
    // }
]);