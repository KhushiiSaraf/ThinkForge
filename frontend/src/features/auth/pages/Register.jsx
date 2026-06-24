import { Eye, Mail, Lock, User, Zap } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
          <Zap className="text-white w-5 h-5" />
        </div>

        <h1 className="mt-2 text-xl font-bold text-slate-900">
          ThinkForge
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Create your account
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Start your 14-day free Pro trial today
          </p>
        </div>

        <form className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="John Doe"
                className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

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
                placeholder="name@company.com"
                className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                placeholder="Create a strong password"
                className="w-full border border-slate-300 rounded-lg pl-10 pr-12 py-3 outline-none focus:ring-2 focus:ring-slate-900"
              />

              <Eye
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Must be at least 8 characters with one special character.
            </p>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-1"
            />

            <p className="text-sm text-slate-600">
              I agree to the{" "}
              <span className="text-blue-600 cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-blue-600 cursor-pointer">
                Privacy Policy
              </span>
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t"></div>

          <span className="px-3 text-xs text-slate-500">
            OR SIGN UP WITH
          </span>

          <div className="flex-1 border-t"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">

          <button className="border rounded-lg py-3 hover:bg-slate-50">
            Google
          </button>

          <button className="border rounded-lg py-3 hover:bg-slate-50">
            Apple
          </button>

        </div>
      </div>

      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{" "}
        <span className="font-medium text-slate-900 cursor-pointer">
          Log in instead
        </span>
      </p>

    </div>
  );
}

