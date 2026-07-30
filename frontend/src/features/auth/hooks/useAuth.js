import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../auth.context"
import { login, register, logout, getMe, sendOtp, verifyOtp } from "../services/auth.api"

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
            } else if (data.requiresVerification) {
                navigate("/verify-email", { state: { userId: data.userId, email } });
                toast.info(data.message);
            } else {
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
            if (data.userId) {
                navigate("/verify-email", { state: { userId: data.userId, email } });
                toast.success("Registered! Check your email for the verification code.");
            } else {
                setError(data?.message || "Registration failed");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyOtp = async ({ userId, otp }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await verifyOtp({ userId, otp });
            if (data.user) {
                setUser(data.user);
                navigate("/dashboard");
                toast.success("Email verified!");
                return true;
            } else {
                setError(data?.message || "Verification failed");
                return false;
            }
        } catch (error) {
            setError(error.response?.data?.message || "Verification failed");
            return false;
        } finally {
            setLoading(false);
        }
    }

    const handleResendOtp = async (userId) => {
        try {
            const data = await sendOtp(userId);
            if (data?.message === "Verification code sent") {
                toast.success(data.message);
                return true;
            } else {
                toast.error(data?.message || "Failed to resend code");
                return false;
            }
        } catch (error) {
            toast.error("Failed to resend code");
            return false;
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

    const refetchUser = async () => {
        try {
            const data = await getMe()
            if (data?.user) {
                setUser(data.user)
            }
        } catch (error) {
            console.error(error)
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
            }
        }
        fetchUser();
    }, [])

    return { user, loading, error, authChecking, handleLogin, handleRegister, handleVerifyOtp, handleResendOtp, handleLogout, refetchUser }
}