import { CalendarDays, Share2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPreview } from '../utils/noteUtils';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

function NoteCard({ note, onDelete, onShare, currentUserId }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/notes/${note._id}`)}
      className="flex min-h-52 cursor-pointer flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <div className="flex-1">
        <h2 className="mb-2 line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100">
          {note.title || 'Untitled'}
        </h2>
        <p className="line-clamp-3 text-sm leading-6 text-slate-400 dark:text-slate-400">
          {getPreview(note.content)}
        </p>
        {String(note.owner?._id) !== String(currentUserId) && note.owner?.name && (
            <p className="mt-2 text-xs font-medium text-indigo-500">
                Shared by {note.owner?.name}
            </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <CalendarDays size={14} />
          {formatDate(note.createdAt)}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
                e.stopPropagation()
                onShare(note._id)
            }}
            className="rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Share2 size={15} className="text-slate-400 dark:text-slate-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(note._id)
            }}
            className="rounded-lg p-2 transition hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 size={15} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteCard;