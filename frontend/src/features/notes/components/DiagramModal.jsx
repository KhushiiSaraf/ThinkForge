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

    // whenever syntax changes, render it with Mermaid
    useEffect(() => {
        if (!syntax || !previewRef.current) return

        const render = async () => {
            try {
                // mermaid.render takes an id and syntax, returns SVG
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
        // get the SVG string and insert into editor
        const svg = previewRef.current.innerHTML
        onInsert(svg)
        onClose()
    }

    return (
        // backdrop
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            {/* modal box */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col gap-4 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Sparkles size={16} className="text-indigo-500" />
                        Generate Diagram
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
                        <X size={16} className="text-slate-500" />
                    </button>
                </div>

                {/* Prompt input */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-slate-600 font-medium">
                        Describe your diagram in plain English
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. types of machine learning, software development lifecycle, how HTTP request works"
                        rows={3}
                        className="text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 resize-none"
                    />
                </div>

                {/* Generate button */}
                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="bg-slate-900 text-white text-sm font-medium py-2 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? 'Generating...' : 'Generate Diagram'}
                    <Sparkles size={14} />
                </button>

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {/* Preview */}
                {syntax && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-slate-600 font-medium">Preview</label>
                        <div
                            ref={previewRef}
                            className="border border-slate-200 rounded-xl p-4 overflow-auto bg-slate-50 flex items-center justify-center min-h-40"
                        />
                        <button
                            onClick={handleInsert}
                            className="bg-indigo-600 text-white text-sm font-medium py-2 rounded-xl hover:bg-indigo-700 transition"
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