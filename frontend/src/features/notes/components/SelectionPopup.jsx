import { useState, useEffect, useRef } from "react"
import { Sparkles, Search, Copy, X } from "lucide-react"

function SelectionPopup({ editor, onRewrite, onSearchWeb, aiLoading }) {
    const [visible, setVisible] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const [mode, setMode] = useState('menu') // 'menu' | 'rewrite'
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

            // Get position of selection in the DOM
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

    // Hide popup on outside click
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
            className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
        >
            {mode === 'menu' ? (
                <div className="flex flex-col py-1 min-w-44">
                    <button
                        onClick={() => setMode('rewrite')}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
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
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                    >
                        <Search size={14} className="text-slate-500" />
                        Search Web
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                    >
                        <Copy size={14} className="text-slate-500" />
                        Copy
                    </button>
                </div>
            ) : (
                <div className="p-3 flex flex-col gap-2 w-64">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                            <Sparkles size={12} className="text-indigo-500" />
                            Rewrite with AI
                        </span>
                        <button onClick={() => setMode('menu')}>
                            <X size={14} className="text-slate-400" />
                        </button>
                    </div>
                    <input
                        autoFocus
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRewriteSubmit()}
                        placeholder="e.g. make it more formal"
                        className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400"
                    />
                    <button
                        onClick={handleRewriteSubmit}
                        disabled={aiLoading || !instruction.trim()}
                        className="bg-slate-900 text-white text-xs font-medium py-2 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
                    >
                        {aiLoading ? 'Rewriting...' : 'Rewrite'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default SelectionPopup