import { CalendarDays, MoreVertical, Sparkles, Share2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function getPreview(content) {
  try {
    const firstNode = content?.content?.find(node => node.content?.length > 0)
    const text = firstNode?.content?.map(n => n.text || '').join('') || ''
    return text || 'No content yet'
  } catch {
    return 'No content yet'
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

function NoteCard({ note, onDelete }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/notes/${note._id}`)}
      className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Sparkles size={18} />
          <span className="text-xs font-semibold uppercase">Note</span>
        </div>
        <button className="rounded-lg p-1 hover:bg-slate-100 transition">
          <MoreVertical size={18} className="text-slate-500" />
        </button>
      </div>

      {/* Title */}
      <div className="mt-5">
        <h2 className="text-lg font-semibold text-slate-900 line-clamp-2">
          {note.title || 'Untitled'}
        </h2>
        <p className="mt-3 text-sm text-slate-500 leading-6 line-clamp-4">
          {getPreview(note.content)}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <CalendarDays size={16} />
            {formatDate(note.createdAt)}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-100 transition">
              <Share2 size={18} className="text-slate-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation() // prevent card click navigating
                onDelete(note._id)
              }}
              className="p-2 rounded-lg hover:bg-red-50 transition"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteCard;