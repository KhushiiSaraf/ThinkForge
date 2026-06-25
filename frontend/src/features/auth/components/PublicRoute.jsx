import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import LoadingSpinner from "../../../components/LoadingSpinner"

function PublicRoute({ children }) {
    const { user, authChecking, loading } = useAuth()

    if(authChecking) return <LoadingSpinner />

    if(user) return <Navigate to="/dashboard" />

    return children
}

export default PublicRoute