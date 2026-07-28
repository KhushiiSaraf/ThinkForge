import { X } from "lucide-react"

function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText = "Confirm", danger = false }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
                    <button onClick={onCancel} className="rounded-lg p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>

                <div className="mt-2 flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
                            danger ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog