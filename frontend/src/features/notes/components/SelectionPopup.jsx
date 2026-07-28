import { useState, useEffect, useRef } from "react"
import { Sparkles, Search, Copy, X } from "lucide-react"

function SelectionPopup({ editor, onRewrite, onSearchWeb, aiLoading }) {
    const [visible, setVisible] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const [mode, setMode] = useState('menu')
    const [instruction, setInstruction] = useState('')
    const popupRef = useRef(null)

    useEffect(() => {
        if (!editor) return

        const handleSelectionUpdate = () => {
            const { from, to } = editor.state.selection
            const selectedText = editor.state.doc.textBetween(from, to, ' ')

            if (selectedText.trim().length === 0) {
                setVisible(false)
                setMode('menu')
                setInstruction('')
                return
            }

            const domSelection = window.getSelection()
            if (!domSelection || domSelection.rangeCount === 0) return

            const range = domSelection.getRangeAt(0)
            const rect = range.getBoundingClientRect()

            setPosition({
                top: rect.top + window.scrollY - 10,
                left: rect.left + rect.width / 2,
            })
            setVisible(true)
        }

        editor.on('selectionUpdate', handleSelectionUpdate)
        return () => editor.off('selectionUpdate', handleSelectionUpdate)
    }, [editor])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setVisible(false)
                setMode('menu')
                setInstruction('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleCopy = () => {
        const { from, to } = editor.state.selection
        const text = editor.state.doc.textBetween(from, to, ' ')
        navigator.clipboard.writeText(text)
        setVisible(false)
    }

    const handleRewriteSubmit = async () => {
        if (!instruction.trim()) return
        const { from, to } = editor.state.selection
        const selectedText = editor.state.doc.textBetween(from, to, ' ')
        await onRewrite(selectedText, instruction, from, to)
        setVisible(false)
        setMode('menu')
        setInstruction('')
    }

    if (!visible) return null

    return (
        <div
            ref={popupRef}
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                transform: 'translate(-50%, -100%)',
                zIndex: 50,
            }}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/95"
        >
            {mode === 'menu' ? (
                <div className="flex min-w-44 flex-col py-1">
                    <button
                        onClick={() => setMode('rewrite')}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <Sparkles size={14} className="text-indigo-500" />
                        Rewrite with AI
                    </button>
                    <button
                        onClick={() => {
                            const { from, to } = editor.state.selection
                            const text = editor.state.doc.textBetween(from, to, ' ')
                            onSearchWeb(text)
                            setVisible(false)
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <Search size={14} className="text-slate-500 dark:text-slate-400" />
                        Search Web
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <Copy size={14} className="text-slate-500 dark:text-slate-400" />
                        Copy
                    </button>
                </div>
            ) : (
                <div className="flex w-64 flex-col gap-2 p-3">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <Sparkles size={12} className="text-indigo-500" />
                            Rewrite with AI
                        </span>
                        <button onClick={() => setMode('menu')}>
                            <X size={14} className="text-slate-400 dark:text-slate-500" />
                        </button>
                    </div>
                    <input
                        autoFocus
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRewriteSubmit()}
                        placeholder="e.g. make it more formal"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                    <button
                        onClick={handleRewriteSubmit}
                        disabled={aiLoading || !instruction.trim()}
                        className="rounded-lg bg-slate-900 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                    >
                        {aiLoading ? 'Rewriting...' : 'Rewrite'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default SelectionPopup