import { X } from "lucide-react"

function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText = "Confirm", danger = false }) {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-800">{title}</h2>
                    <button onClick={onCancel} className="p-1 rounded-lg hover:bg-slate-100">
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>

                {/* Message */}
                <p className="text-sm text-slate-500">{message}</p>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 mt-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm rounded-xl text-white font-medium transition ${
                            danger ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-900 hover:bg-slate-800'
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