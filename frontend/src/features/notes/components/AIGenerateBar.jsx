import { Sparkles } from "lucide-react"
import { useState } from "react"

function AIGenerateBar({ onGenerate, loading }) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    await onGenerate(prompt)
    setPrompt('')
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-30">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-3">
        <Sparkles size={18} className="text-indigo-600 shrink-0" />
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Ask AI to expand on this topic or generate a summary..."
          className="flex-1 outline-none text-sm bg-transparent"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !prompt.trim()}
          className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Generating...' : 'Generate'}
          <Sparkles size={14} />
        </button>
      </div>
    </div>
  )
}

export default AIGenerateBar