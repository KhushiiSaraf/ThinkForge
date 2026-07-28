import { Zap, Sparkles, Search, Users, Check } from "lucide-react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../features/auth/hooks/useAuth"
import { usePayment } from "../features/notes/hooks/usePayment"
import ThemeToggle from "../features/theme/ThemeToggle"

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 dark:bg-white">
            <Zap className="h-4 w-4 text-white dark:text-slate-900" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">ThinkForge</span>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex dark:text-slate-300">
          <a href="#features" className="transition hover:text-slate-900 dark:hover:text-white">Features</a>
          <a href="#pricing" className="transition hover:text-slate-900 dark:hover:text-white">Pricing</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link to="/login" className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-5">
            Login
          </Link>
          <Link to="/register" className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 sm:px-5">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { handlePayment, loading: paymentLoading } = usePayment()

  const handleGoPro = () => {
      if (!user) {
          navigate('/register')
          return
      }
      if (user.plan === 'pro') {
          navigate('/dashboard')
          return
      }
      handlePayment(user, () => navigate('/dashboard'))
  }
  return (
    <div className="bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      {/* HERO */}
      <section className="min-h-screen flex items-center py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 dark:bg-slate-800 dark:text-blue-300">
            Now with GPT-4 Integration
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Research faster.
            <br />
            <span className="text-blue-600 dark:text-blue-400">Write smarter.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg">
            The AI-powered note editor that brings the entire web into your writing space. Connect ideas, search instantly, and generate insights in real time.
          </p>
          <div className="flex flex-col gap-3 mt-8 justify-center sm:flex-row">
            <Link to="/register" className="rounded-xl bg-slate-900 px-7 py-4 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-500">
              Start Building for Free →
            </Link>
            <a href="#demo" className="rounded-xl border border-slate-300 px-7 py-4 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="bg-slate-50 py-16 transition-colors duration-300 dark:bg-slate-900 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Watch the demo</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">See ThinkForge in action</h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-500 dark:text-slate-400">
            A quick walkthrough of the AI workspace, note editor, and collaboration features.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl dark:border-slate-700">
            <div className="aspect-video flex items-center justify-center px-4 text-slate-500 dark:text-slate-400">
              <p className="text-sm">Demo video coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto py-16 px-4 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-10 text-center sm:mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl dark:text-white">Built for modern workflows</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">Everything you need to turn information into polished knowledge.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-500 p-6 transition hover:shadow-md sm:p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold dark:text-white">AI Writing Assistant</h3>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">Let AI help you draft summaries, rewrite content, and brainstorm ideas that match your style.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-500 p-6 hover:shadow-md transition sm:p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold dark:text-white">In-Editor Web Search</h3>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">Search the web without leaving your document. Drag and drop sources directly into your notes.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-500 p-6 hover:shadow-md transition sm:p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold dark:text-white">Real-time Collaboration</h3>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">Work with your team in real time. Shared workspaces, comments, and version history.</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-slate-50 px-4 py-16 transition-colors duration-300 dark:bg-slate-900 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center sm:mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl dark:text-white">Simple, transparent pricing</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">Start free and upgrade as you grow.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 transition-colors duration-300 dark:border-slate-600 dark:bg-slate-900">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Free</h3>
              <div className="mt-4 text-4xl font-bold dark:text-white">
                ₹0 <span className="text-lg font-normal text-slate-400">/mo</span>
              </div>
              <ul className="mt-8 space-y-3">
                {['Up to 20 notes', 'Basic AI assistance', 'Web search integration'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Check size={16} className="shrink-0 text-slate-400 dark:text-slate-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                  onClick={() => navigate(user ? '/dashboard' : '/register')}
                  className="mt-10 w-full rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                  {user ? 'Go to Dashboard' : 'Get Started Free'}
              </button>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-slate-900 bg-white p-8 transition-colors duration-300 dark:border-indigo-500 dark:bg-slate-900">
              <span className="absolute -top-3 right-6 rounded-full bg-slate-900 px-4 py-1 text-xs font-medium text-white dark:bg-indigo-600">
                Most Popular
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Pro</h3>
              <div className="mt-4 text-4xl font-bold dark:text-white">
                ₹99 <span className="text-lg font-normal text-slate-400">/mo</span>
              </div>
              <ul className="mt-8 space-y-3">
                {['Unlimited AI queries', 'Advanced GPT-4 assistance', 'Full web search integration', 'Export to PDF & Markdown', 'Real-time collaboration', 'Priority support'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Check size={16} className="shrink-0 text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleGoPro}
                disabled={paymentLoading}
                className="mt-10 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              >
                {paymentLoading ? 'Processing...' : user?.plan === 'pro' ? 'Go to Dashboard' : 'Go Pro'}
             </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="border-t border-slate-200 bg-white py-8 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
              <Zap className="h-3 w-3 text-white dark:text-slate-900" />
            </div>
            <span className="text-sm font-bold dark:text-white">ThinkForge</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Privacy</a>
            <a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Terms</a>
            <a href="#" className="transition hover:text-slate-900 dark:hover:text-white">Contact</a>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">© 2026 ThinkForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}