import { useState, useEffect, useRef } from "react"
import { X, Sparkles } from "lucide-react"
import mermaid from "mermaid"

// initialize mermaid once
mermaid.initialize({ startOnLoad: false, theme: 'default' })

function DiagramModal({ onClose, onInsert, onGenerate, loading }) {
    const [prompt, setPrompt] = useState('')
    const [syntax, setSyntax] = useState('')
    const [error, setError] = useState('')
    const previewRef = useRef(null)

    useEffect(() => {
        if (!syntax || !previewRef.current) return

        const render = async () => {
            try {
                const { svg } = await mermaid.render('diagram-preview', syntax)
                previewRef.current.innerHTML = svg
                setError('')
            } catch (err) {
                setError('Invalid diagram syntax — try rephrasing your prompt')
                previewRef.current.innerHTML = ''
            }
        }

        render()
    }, [syntax])

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        setError('')
        const result = await onGenerate(prompt)
        if (result) {
            setSyntax(result)
        } else {
            setError('Generation failed, try again')
        }
    }

    const handleInsert = () => {
        if (!previewRef.current?.innerHTML) return
        const svg = previewRef.current.innerHTML
        onInsert(svg)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="diagram-dialog-scrollbar mx-4 flex w-full max-w-lg max-h-[90vh] flex-col gap-4 overflow-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                        <Sparkles size={16} className="text-indigo-500" />
                        Generate Diagram
                    </h2>
                    <button onClick={onClose} className="rounded-lg p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X size={16} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Describe your diagram in plain English
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. types of machine learning, software development lifecycle, how HTTP request works"
                        rows={3}
                        className="resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                    {loading ? 'Generating...' : 'Generate Diagram'}
                    <Sparkles size={14} />
                </button>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {syntax && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Preview</label>
                        <div
                            ref={previewRef}
                            className="diagram-scrollbar w-full flex min-h-48 max-h-[60vh] items-start justify-center overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                        <button
                            onClick={handleInsert}
                            className="rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                            Insert into Note
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DiagramModal