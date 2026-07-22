// features/notes/components/AIGenerateBar.jsx
import { Sparkles, BookOpen, Upload, Loader2 } from "lucide-react"
import { useState, useRef } from "react"

function AIGenerateBar({
  onGenerate,
  loading,
  isPro,
  pdfStatus,        // null | 'processing' | 'ready' | 'failed'
  fileName,
  checkingExisting,
  uploading,
  asking,
  answer,
  onUploadPdf,
  onAskPdf,
  onInsertAnswer,
  onDismissAnswer,
}) {
  const [prompt, setPrompt] = useState('')
  const [pdfMode, setPdfMode] = useState(false)
  const fileInputRef = useRef(null)

  const handleToggleMode = () => {
    if (!isPro) return
    setPdfMode((prev) => !prev)
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return
    if (pdfMode) {
      await onAskPdf(prompt)
    } else {
      await onGenerate(prompt)
    }
    setPrompt('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onUploadPdf(file)
    e.target.value = '' // allow re-selecting the same file later
  }

  const isPdfReady = pdfStatus === 'ready'
  const isPdfProcessing = pdfStatus === 'processing' || uploading

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-30">

      {/* Answer card — only shown in PDF mode after a question was asked */}
      {pdfMode && answer && (
        <div className="mb-2 bg-white border border-slate-200 rounded-2xl shadow-lg p-4 max-h-[50vh] overflow-y-auto">
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{answer}</p>
          <div className="flex items-center gap-3 mt-3 sticky bottom-0 bg-white pt-2">
            <button
              onClick={() => { onInsertAnswer(answer); onDismissAnswer() }}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Insert into note
            </button>
            <button
              onClick={onDismissAnswer}
              className="text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-3">
        <div className="relative group shrink-0">
  <button
    onClick={() => setPdfMode(false)}
    className={`p-1 rounded-lg transition ${
      !pdfMode ? "bg-indigo-50 text-indigo-600" : "text-slate-300 hover:text-slate-500"
    }`}
  >
    <Sparkles size={18} />
  </button>
  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded-lg">
    {pdfMode ? "Switch to general AI" : "Generate with AI"}
  </div>
</div>

<div className="relative group shrink-0">
  <button
    onClick={handleToggleMode}
    disabled={!isPro}
    className={`p-1 rounded-lg transition ${
      pdfMode ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"
    } ${!isPro ? "opacity-40 cursor-not-allowed" : ""}`}
  >
    <BookOpen size={18} />
  </button>
  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded-lg">
    {isPro ? (pdfMode ? "Ask PDF (active)" : "Switch to Ask PDF") : "Ask PDF — Pro only"}
  </div>
</div>

        {/* PDF mode, but no ready PDF yet: show upload prompt instead of the input */}
        {pdfMode && !isPdfReady ? (
          <div className="flex-1 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              {checkingExisting
                ? "Checking for existing PDF..."
                : isPdfProcessing
                ? "Processing PDF..."
                : pdfStatus === 'failed'
                ? "Processing failed — try again"
                : "Upload a PDF to ask questions about it"}
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isPdfProcessing || checkingExisting}
              title="Maximum PDF file size: 20 MB"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50"
            >
              {isPdfProcessing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={
                pdfMode
                  ? `Ask a question about ${fileName || 'your PDF'}...`
                  : "Ask AI to expand on this topic or generate a summary..."
              }
              className="flex-1 outline-none text-sm bg-transparent"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || asking || !prompt.trim()}
              className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2"
            >
              {pdfMode ? (asking ? 'Thinking...' : 'Ask') : (loading ? 'Generating...' : 'Generate')}
              <Sparkles size={14} />
            </button>
          </>
        )}
      </div>

      {pdfMode && isPdfReady && (
        <div className="mt-1.5 bg-white border border-slate-200 rounded-xl shadow-md px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-slate-500 truncate mr-2">Answering from: {fileName}</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Maximum PDF file size: 20 MB"
            className="text-xs font-medium text-slate-400 hover:text-indigo-600 shrink-0"
          >
            Replace PDF
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}

export default AIGenerateBar