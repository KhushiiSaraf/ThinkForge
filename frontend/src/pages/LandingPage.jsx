import { Zap, Sparkles, Search, Users, Check } from "lucide-react"
import { Link } from "react-router-dom"

function Navbar() {
  return (
    <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">ThinkForge</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-slate-900">Features</a>
          <a href="#pricing" className="transition hover:text-slate-900">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-full border border-slate-300 px-5 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
            Login
          </Link>
          <Link to="/register" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Landing() {
  return (
    <div className="bg-white text-slate-900">
      <Navbar />

      {/* HERO */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <span className="inline-block text-blue-600 font-semibold text-sm mb-4 bg-blue-50 px-3 py-1 rounded-full">
            Now with GPT-4 Integration
          </span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Research faster.
            <br />
            <span className="text-blue-600">Write smarter.</span>
          </h1>
          <p className="text-slate-500 mt-6 text-lg leading-relaxed max-w-xl mx-auto">
            The AI-powered note editor that brings the entire web into your writing space. Connect ideas, search instantly, and generate insights in real time.
          </p>
          <div className="flex gap-4 mt-8 justify-center">
            <Link to="/register" className="rounded-xl bg-slate-900 px-7 py-4 text-white text-sm font-semibold transition hover:bg-slate-700">
              Start Building for Free →
            </Link>
            <a href="#demo" className="rounded-xl border border-slate-300 px-7 py-4 text-slate-700 text-sm transition hover:bg-slate-100">
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">Watch the demo</p>
          <h2 className="text-3xl font-bold text-slate-900">See ThinkForge in action</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500 leading-7">
            A quick walkthrough of the AI workspace, note editor, and collaboration features.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl">
            <div className="aspect-video flex items-center justify-center text-slate-500">
              <p className="text-sm">Demo video coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto py-24 px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Built for modern workflows</h2>
          <p className="text-slate-500 mt-3">Everything you need to turn information into polished knowledge.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-8 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Writing Assistant</h3>
            <p className="text-slate-500 text-sm leading-6">Let AI help you draft summaries, rewrite content, and brainstorm ideas that match your style.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-8 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">In-Editor Web Search</h3>
            <p className="text-slate-500 text-sm leading-6">Search the web without leaving your document. Drag and drop sources directly into your notes.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-8 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Collaboration</h3>
            <p className="text-slate-500 text-sm leading-6">Work with your team in real time. Shared workspaces, comments, and version history.</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-slate-50 py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Simple, transparent pricing</h2>
            <p className="text-slate-500 mt-3">Start free and upgrade as you grow.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Free</h3>
              <div className="mt-4 text-4xl font-bold">
                ₹0 <span className="text-lg text-slate-400 font-normal">/mo</span>
              </div>
              <ul className="mt-8 space-y-3">
                {['Up to 20 notes', 'Basic AI assistance', 'Web search integration'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={16} className="text-slate-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full mt-10 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                Current Plan
              </button>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-slate-900 bg-white p-8">
              <span className="absolute -top-3 right-6 rounded-full bg-slate-900 px-4 py-1 text-xs text-white font-medium">
                Most Popular
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Pro</h3>
              <div className="mt-4 text-4xl font-bold">
                ₹999 <span className="text-lg text-slate-400 font-normal">/mo</span>
              </div>
              <ul className="mt-8 space-y-3">
                {['Unlimited AI queries', 'Advanced GPT-4 assistance', 'Full web search integration', 'Export to PDF & Markdown', 'Real-time collaboration', 'Priority support'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={16} className="text-blue-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full mt-10 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition">
                Go Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="border-t bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm">ThinkForge</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 transition">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition">Terms</a>
            <a href="#" className="hover:text-slate-900 transition">Contact</a>
          </div>
          <p className="text-xs text-slate-400">© 2026 ThinkForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}