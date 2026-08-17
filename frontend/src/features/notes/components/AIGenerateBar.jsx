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
    <div className="fixed bottom-6 left-1/2 z-30 w-full max-w-xl -translate-x-1/2 px-4">
      {pdfMode && answer && (
        <div className="pdf-answer-scrollbar mb-2 flex max-h-[50vh] flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-lg transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{answer}</p>
          <div className="sticky bottom-0 mt-3 flex items-center justify-end gap-3 border-t border-slate-200 bg-white pt-3 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => { onInsertAnswer(answer); onDismissAnswer() }}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              Insert into note
            </button>
            <button
              onClick={onDismissAnswer}
              className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-lg transition-colors duration-300 sm:flex-row sm:items-center sm:gap-2 sm:px-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="group relative shrink-0">
          <button
            onClick={() => setPdfMode(false)}
            className={`rounded-lg p-1 transition ${
              !pdfMode ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300" : "text-slate-300 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles size={18} />
          </button>
          <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
            {pdfMode ? "Switch to general AI" : "Generate with AI"}
          </div>
        </div>

        <div className="group relative shrink-0">
          <button
            onClick={handleToggleMode}
            disabled={!isPro}
            className={`rounded-lg p-1 transition ${
              pdfMode ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200"
            } ${!isPro ? "cursor-not-allowed opacity-40" : ""}`}
          >
            <BookOpen size={18} />
          </button>
          <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
            {isPro ? (pdfMode ? "Ask PDF (active)" : "Switch to Ask PDF") : "Ask PDF — Pro only"}
          </div>
        </div>

        {pdfMode && !isPdfReady ? (
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="min-w-0 flex-1 text-sm text-slate-500 dark:text-slate-400">
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
              className="flex items-center justify-center gap-1 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50 dark:border-slate-700 dark:text-indigo-300 dark:hover:text-indigo-200 sm:self-auto"
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
              className="min-w-0 flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || asking || !prompt.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 sm:w-auto dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              {pdfMode ? (asking ? 'Thinking...' : 'Ask') : (loading ? 'Generating...' : 'Generate')}
              <Sparkles size={14} />
            </button>
          </>
        )}
      </div>

      {pdfMode && isPdfReady && (
        <div className="mt-1.5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <span className="mr-2 truncate text-xs text-slate-500 dark:text-slate-400">Answering from: {fileName}</span>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Maximum PDF file size: 20 MB"
            className="shrink-0 text-xs font-medium text-slate-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
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