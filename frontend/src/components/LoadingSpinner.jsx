import { Zap } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 transition-colors duration-300 dark:bg-slate-950">

      {/* Logo */}
      <div className="relative">
        {/* Outer pulse */}
        <div className="absolute inset-0 rounded-xl bg-slate-900/10 dark:bg-slate-500 animate-ping"></div>

        {/* Logo Box */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 shadow-lg dark:bg-white">
          <Zap className="h-6 w-6 text-white dark:text-slate-900" />
        </div>
      </div>

      {/* Brand */}
      <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
        ThinkForge
      </h2>

      {/* Text */}
      <p className="mt-2 animate-pulse text-sm text-slate-500 dark:text-slate-400">
        Forging insights...
      </p>
    </div>
  );
}

export default LoadingSpinner;