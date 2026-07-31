import { ArrowLeft, FileDown, Share2 } from "lucide-react"
import html2pdf from 'html2pdf.js'
import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

function EditorTopBar({ title, setTitle, saving, saved, onSave, onShareClick, onBackClick }) {
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  const handleExportPDF = () => {
    const element = document.querySelector('.tiptap')
    if (!element) {
      setExportDialogOpen(false)
      return
    }

    const clone = element.cloneNode(true)
    clone.classList.add('pdf-export-light')
    clone.style.border = 'none'
    clone.style.padding = '0'
    clone.style.minHeight = 'auto'
    clone.style.height = 'auto'
    clone.style.maxHeight = 'none'
    clone.style.overflow = 'visible'
    clone.style.background = '#ffffff'
    clone.style.color = '#0f172a'

    clone.querySelectorAll('p, h1, h2, h3, li').forEach((node) => {
      node.style.color = '#0f172a'
      node.style.backgroundColor = 'transparent'
    })

    clone.querySelectorAll('pre').forEach((node) => {
      node.style.background = '#111827'
      node.style.color = '#e5e7eb'
      node.style.border = '1px solid #263244'
    })

    clone.querySelectorAll('pre code').forEach((node) => {
      node.style.background = 'transparent'
      node.style.color = '#e5e7eb'
      node.style.border = '0'
    })

    const options = {
      margin: 1,
      filename: `${title || 'note'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }

    html2pdf().set(options).from(clone).save()
    setExportDialogOpen(false)
  }

  return (
    <>
      <div className="sticky top-0 z-40 flex flex-col gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/95 sm:px-6 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <button onClick={onBackClick} className="self-start rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:self-auto">
          <ArrowLeft size={18} className="text-slate-600 dark:text-slate-300" />
        </button>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full border-none bg-transparent text-base font-semibold outline-none text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500 sm:text-lg"
        />
        <span className="self-start rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:self-auto">
          {saving ? 'SAVING...' : saved ? 'SAVED' : 'UNSAVED'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          onClick={() => setExportDialogOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
            <FileDown size={16} />
            Export PDF
        </button>
        <button
          onClick={onShareClick}
          className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
         >
          <Share2 size={16} />
          Share
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      </div>

      {exportDialogOpen && (
        <ConfirmDialog
          title="Download PDF?"
          message="Do you want to download this note as a PDF?"
          confirmText="Download"
          onConfirm={handleExportPDF}
          onCancel={() => setExportDialogOpen(false)}
        />
      )}
    </>
  )
}

export default EditorTopBar