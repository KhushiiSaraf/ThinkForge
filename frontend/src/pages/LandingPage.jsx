import React from "react"
import { Zap } from "lucide-react"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import { Link } from "react-router-dom"

function Navbar() {
  return (
    <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
          <span className="text-lg font-semibold tracking-tight">ThinkForge</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-slate-900">Features</a>
          <a href="#pricing" className="transition hover:text-slate-900">Pricing</a>
          <a href="#footer" className="transition hover:text-slate-900">About</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="rounded-full border border-slate-300 px-5 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
            Login
          </Link>
          <Link to="/register" className="rounded-full bg-slate-900 px-5 border py-2 text-sm font-semibold text-white transition hover:bg-white hover:border hover:border-slate-900 hover:text-slate-900">
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

      <section className="min-h-screen">
        <div className="max-w-7xl mx-auto flex h-screen items-center justify-between px-8">
          <div className="w-[48%]">
            <p className="text-blue-600 font-semibold mb-4">AI Assistant Platform</p>
            <h1 className="text-6xl font-bold leading-tight">
              Research faster.
              <br />
              <span className="text-blue-600">Write smarter.</span>
            </h1>
            <p className="text-gray-500 mt-6 text-lg">
              The AI-powered note editor that brings the entire web into your writing space.
            </p>
            <div className="flex gap-5 mt-8">
              <button className="rounded-xl bg-slate-900 px-7 py-4 text-white transition border hover:bg-white hover:border hover:border-slate-900 hover:text-slate-900">
                Start Building
              </button>
              <button className="rounded-xl border border-slate-300 px-7 py-4 text-slate-700 transition hover:bg-slate-100">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="w-[48%]">
            <img src="/hero.png" alt="Hero illustration" className="rounded-2xl shadow-2xl" />
          </div>
        </div>
      </section>

      <section id="demo" className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Watch the demo</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">See ThinkForge in action</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
            A quick walkthrough of the AI workspace, note editor, and collaboration features.
          </p>
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-black/95 shadow-xl">
            <div className="aspect-video bg-slate-800 p-4 text-slate-400">
              <p className="mt-24 text-lg font-semibold">Your demo video goes here</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto py-28 px-8">
        <h2 className="text-5xl font-bold text-center">Built for modern workflows</h2>
        <p className="text-center text-gray-500 mt-3">
          Everything you need to turn information into polished knowledge.
        </p>

        <div className="grid gap-8 mt-20 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 p-8 shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-blue-100" />
            <h3 className="text-xl font-semibold mt-6">AI Writing Assistant</h3>
            <p className="text-gray-500 mt-3">Let AI help you draft summaries and brainstorm ideas.</p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 p-8 shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-blue-100" />
            <h3 className="text-xl font-semibold mt-6">In-editor Web Search</h3>
            <p className="text-gray-500 mt-3">Search the web without leaving your editor.</p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 p-8 shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-blue-100" />
            <h3 className="text-xl font-semibold mt-6">Real-time Collaboration</h3>
            <p className="text-gray-500 mt-3">Work with teammates in real time.</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="max-w-6xl mx-auto py-20 px-8">
        <h2 className="text-4xl font-bold text-center">Simple, transparent pricing</h2>
        <p className="text-center text-gray-500 mt-3">Start free and upgrade as you grow.</p>

        <div className="grid gap-10 mt-16 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/70 p-8 shadow-sm">
            <h3 className="text-xl font-bold">FREE</h3>
            <div className="mt-5 text-4xl font-bold">
              ?0
              <span className="text-lg text-gray-500">/month</span>
            </div>
            <ul className="mt-8 space-y-3 text-gray-600">
              <li>? Up to 20 AI queries/day</li>
              <li>? Basic AI assistance</li>
              <li>? Email support</li>
            </ul>
            <button className="w-full mt-10 rounded-xl border border-slate-300 px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Current Plan
            </button>
          </div>

          <div className="relative rounded-2xl border-2 border-slate-900 p-8 shadow-lg shadow-slate-200/20">
            <span className="absolute -top-4 right-8 rounded-full bg-slate-900 px-4 py-1 text-sm text-white">
              Most Popular
            </span>
            <h3 className="text-xl font-bold">PRO</h3>
            <div className="mt-5 text-4xl font-bold">
              ?999
              <span className="text-lg text-gray-500">/month</span>
            </div>
            <ul className="mt-8 space-y-3 text-gray-600">
              <li>? Unlimited AI queries</li>
              <li>? Advanced GPT models</li>
              <li>? Team collaboration</li>
              <li>? Priority support</li>
            </ul>
            <button className="w-full mt-10 rounded-xl bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
              Go Pro
            </button>
          </div>
        </div>
      </section>

      <footer id="footer" className="border-t bg-slate-50 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 md:flex-row">
          <h2 className="font-bold">ThinkForge</h2>
          <div className="flex flex-wrap justify-center gap-8 text-gray-500">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
