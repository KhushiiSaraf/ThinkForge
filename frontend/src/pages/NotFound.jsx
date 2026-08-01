import { useNavigate } from "react-router-dom"
import { Zap } from "lucide-react"

function NotFound() {
    const navigate = useNavigate()

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 text-center transition-colors duration-300 dark:bg-slate-950 sm:px-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_42%)] dark:bg-[radial-gradient(circle_at_top,rgba(71,85,105,0.22),transparent_42%)]" />
            <div className="relative flex w-full max-w-md flex-col items-center">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 shadow-lg shadow-slate-900/10 dark:bg-white dark:shadow-black/20 sm:mb-8">
                <Zap className="h-5 w-5 text-white dark:text-slate-900" />
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Page not found</p>
            <h1 className="mb-3 text-6xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-8xl">404</h1>
            <p className="mb-8 max-w-xs text-base leading-7 text-slate-500 dark:text-slate-400 sm:mb-10 sm:max-w-sm sm:text-lg">Oops! This page doesn't exist.</p>
            <button
                onClick={() => navigate('/')}
                className="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-white dark:text-slate-900 dark:shadow-black/20 dark:hover:bg-slate-200 dark:focus:ring-slate-500 dark:focus:ring-offset-slate-950 sm:w-auto sm:min-w-36"
            >
                Go Home
            </button>
            </div>
        </main>
    )
}

export default NotFound