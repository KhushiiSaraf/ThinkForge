import { CalendarDays, Share2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function getPreview(content) {
  try {
    const firstNode = content?.content?.find(node => node.content?.length > 0)
    const text = firstNode?.content?.map(n => n.text || '').join('') || ''
    return text.replace(/#{1,6}\s/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim() || 'No content yet'
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
      className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 cursor-pointer min-h-52"
    >
      {/* Title + Preview */}
      <div className="flex-1">
        <h2 className="text-base font-semibold text-slate-900 line-clamp-2 mb-2">
          {note.title || 'Untitled'}
        </h2>
        <p className="text-sm text-slate-400 leading-6 line-clamp-3">
          {getPreview(note.content)}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <CalendarDays size={14} />
          {formatDate(note.createdAt)}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <Share2 size={15} className="text-slate-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(note._id)
            }}
            className="p-2 rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={15} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteCard;