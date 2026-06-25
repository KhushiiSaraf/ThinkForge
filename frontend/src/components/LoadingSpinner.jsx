import { Zap } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50">

      {/* Logo */}
      <div className="relative">
        {/* Outer pulse */}
        <div className="absolute inset-0 rounded-xl bg-slate-900/10 animate-ping"></div>

        {/* Logo Box */}
        <div className="relative w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Brand */}
      <h2 className="mt-5 text-xl font-bold text-slate-900">
        ThinkForge
      </h2>

      {/* Text */}
      <p className="mt-2 text-sm text-slate-500 animate-pulse">
        Forging insights...
      </p>
    </div>
  );
}

export default LoadingSpinner;