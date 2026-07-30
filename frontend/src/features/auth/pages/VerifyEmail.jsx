import { ShieldCheck, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, email } = location.state || {};

    const [otp, setOtp] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const { loading, error, handleVerifyOtp, handleResendOtp } = useAuth();

    // If someone lands here directly (e.g. page refresh) with no state, send them back
    useEffect(() => {
        if (!userId) navigate("/register");
    }, [userId, navigate]);

    // Client-side cooldown countdown — purely visual; the backend enforces the real 60s limit regardless
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) return;
        const success = await handleVerifyOtp({ userId, otp });
        if (!success) setOtp("");
    }

    const onResend = async () => {
        const success = await handleResendOtp(userId);
        if (success) setCooldown(60);
    }

    if (!userId) return null; // brief flash before the redirect effect kicks in

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 transition-colors duration-300 dark:bg-slate-950">

            <div className="mb-6 flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-white">
                    <Zap className="h-4 w-4 text-white dark:text-slate-900" />
                </div>
                <h1 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">ThinkForge</h1>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">

                <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10">
                        <ShieldCheck size={18} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verify your email</h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        We sent a 6-digit code to {email || "your email"}
                    </p>
                </div>

                <form className="space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-700">Verification code</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                            className="w-full rounded-lg border border-slate-200 bg-transparent py-2.5 px-4 text-center text-lg tracking-[0.5em] text-slate-900 outline-none transition focus:ring-2 focus:ring-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                    >
                        {loading && (
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {loading ? "Verifying..." : "Verify email"}
                    </button>
                </form>

                <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    Didn't get the code?{" "}
                    <button
                        onClick={onResend}
                        disabled={cooldown > 0}
                        className="text-indigo-500 hover:underline disabled:text-slate-400 disabled:no-underline dark:disabled:text-slate-600"
                    >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                    </button>
                </p>
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                <Link to="/register" className="text-indigo-500 hover:underline">Use a different email</Link>
            </p>
        </div>
    );
}