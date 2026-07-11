import { Eye, EyeOff, Mail, Lock, User, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { loading, error, handleRegister } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        await handleRegister({ name, email, password });
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">

            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
                    <Zap className="text-white w-4 h-4" />
                </div>
                <h1 className="mt-2 text-lg font-bold text-slate-900">ThinkForge</h1>
            </div>

            {/* Card */}
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
                    <p className="mt-1 text-xs text-slate-500">Start writing smarter today</p>
                </div>

                <form className="space-y-4" onSubmit={onSubmit}>

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-700">Full name</label>
                        <div className="relative">
                            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                    </div>

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
                                className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-700">Password</label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a strong password"
                                className="w-full border border-slate-200 rounded-lg pl-9 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword
                                    ? <EyeOff size={15} className="text-slate-400" />
                                    : <Eye size={15} className="text-slate-400" />
                                }
                            </button>
                        </div>
                        <p className="mt-1.5 text-xs text-slate-400">
                            At least 8 characters with one special character.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-500 text-xs text-center">{error}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50"
                    >
                        {loading && (
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <p className="mt-4 text-xs text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-500 hover:underline">Login</Link>
            </p>
        </div>
    );
}