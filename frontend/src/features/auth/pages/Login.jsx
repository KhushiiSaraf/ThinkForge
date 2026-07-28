import { Mail, Lock, Eye, EyeOff, Zap, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { loading, error, handleLogin } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({ email, password });
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 transition-colors duration-300 dark:bg-slate-950">

            {/* Logo */}
            <div className="mb-6 flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-white">
                    <Zap className="h-4 w-4 text-white dark:text-slate-900" />
                </div>
                <h1 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">ThinkForge</h1>
            </div>

            {/* Card */}
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">

                <div className="mb-6 text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Sign in to your research workspace</p>
                </div>

                <form className="space-y-4" onSubmit={onSubmit}>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-700">Email address</label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full rounded-lg border border-slate-200 bg-transparent py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-medium text-slate-700">Password</label>
                            <button type="button" className="text-xs text-blue-600 transition hover:underline dark:text-blue-400">
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full rounded-lg border border-slate-200 bg-transparent py-2.5 pl-9 pr-9 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                            >
                                {showPassword
                                    ? <EyeOff size={15} className="text-slate-400" />
                                    : <Eye size={15} className="text-slate-400" />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-500 text-xs text-center">{error}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                    >
                        {loading && (
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>

            {/* Footer */}
           <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-500 hover:underline">Register</Link>
          </p>
        </div>
    );
}

export default Login;