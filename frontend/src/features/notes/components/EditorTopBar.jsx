import { ArrowLeft, FileDown, Share2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import html2pdf from 'html2pdf.js'

function EditorTopBar({ title, setTitle, saving, saved, onSave }) {
  const navigate = useNavigate()

   const handleExportPDF = () => {
    const element = document.querySelector('.tiptap')
    if (!element) return

    const clone = element.cloneNode(true)
    clone.style.border = 'none'
    clone.style.padding = '0'
    clone.style.minHeight = 'auto'

    const options = {
    margin: 1,
    filename: `${title || 'note'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  }

    html2pdf().set(options).from(clone).save()
}

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-slate-100">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="text-lg font-semibold outline-none border-none bg-transparent"
        />
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
          {saving ? 'SAVING...' : saved ? 'SAVED' : 'UNSAVED'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-lg"
        >
            <FileDown size={16} />
            Export PDF
        </button>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-lg">
          <Share2 size={16} />
          Share
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default EditorTopBar