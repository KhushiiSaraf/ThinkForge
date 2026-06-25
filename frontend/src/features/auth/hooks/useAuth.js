import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../auth.context"
import { login, register, logout, getMe } from "../services/auth.api"

export const useAuth = () => {
    const { user, setUser, loading, setLoading, authChecking, setAuthChecking } = useContext(AuthContext);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await login({ email, password });
            if (data.user) {
                setUser(data.user);
                navigate("/dashboard");
                toast.success("Logged in successfully");
            }
            else {
                setError(data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async ({ name, email, password }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await register({ name, email, password });
            if (data.user) {
                navigate("/login");
                toast.success("Registered successfully. Please login.");
            }
            else {
                setError(data?.message || "Registration failed");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            navigate('/')
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMe();
                if (data?.user) {
                    setUser(data.user);
                }
            } catch (error) {
                setUser(null);
            }
            finally {
                setAuthChecking(false);
                // setLoading(false);
            }
        }
        fetchUser();
    }, [])

    return { user, loading, error, authChecking, handleLogin, handleRegister, handleLogout };
}