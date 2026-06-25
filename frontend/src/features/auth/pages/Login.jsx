import { Mail, Lock, Eye, Zap, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loading, error, handleLogin } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({ email, password });
    }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>

        <h1 className="mt-2 text-xl font-bold text-slate-900">
          ThinkForge
        </h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to your research workspace
          </p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full border border-slate-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">
                Password
              </label>

              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />

              <Eye
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4"
            />

            <label
              htmlFor="remember"
              className="text-sm text-slate-600"
            >
              Remember me for 30 days
            </label>
          </div>
          {/*Error msg */}
            {error && (
            <div className="text-red-500 text-sm text-center">
            {error}
            </div>
            )}       
          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition"
          >
            {/* btn text change */}
            {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            {loading ? "Logging in..." : "Login"}
            <LogIn size={18} />
          </button>

        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t"></div>

          <span className="px-3 text-xs text-slate-500 uppercase">
            Or continue with
          </span>

          <div className="flex-1 border-t"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">

          <button
            className="border border-slate-300 rounded-lg py-3 text-sm font-medium hover:bg-slate-50 transition"
          >
            Google
          </button>

          <button
            className="border border-slate-300 rounded-lg py-3 text-sm font-medium hover:bg-slate-50 transition"
          >
            Apple
          </button>

        </div>

      </div>

      {/* Footer */}
      <p className="mt-6 text-sm text-slate-600">
        Don't have an account?{" "}
        <span className="text-indigo-400 cursor-pointer hover:underline">
            <Link to="/register">Register</Link>
        </span>
      </p>

    </div>
  );
}

export default Login;