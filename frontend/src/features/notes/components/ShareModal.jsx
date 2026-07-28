import { useState } from "react"
import { X, UserPlus, Check } from "lucide-react"
import axios from "axios"

function ShareModal({ noteId, onClose }) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleShare = async () => {
        if (!email.trim()) return
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const api = axios.create({
                baseURL: import.meta.env.VITE_API_URL,
                withCredentials: true
            })
            const response = await api.post(`/api/notes/${noteId}/share`, { email })
            setSuccess(response.data.message)
            setEmail('')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="mx-4 flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                        <UserPlus size={16} className="text-indigo-500" />
                        Share Note
                    </h2>
                    <button onClick={onClose} className="rounded-lg p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter the email of the user you want to collaborate with. They must already have a ThinkForge account.
                </p>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleShare()}
                    placeholder="collaborator@email.com"
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    autoFocus
                />

                {error && <p className="text-xs text-red-500">{error}</p>}

                {success && (
                    <p className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <Check size={12} />
                        {success}
                    </p>
                )}

                <button
                    onClick={handleShare}
                    disabled={loading || !email.trim()}
                    className="rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                    {loading ? 'Sharing...' : 'Share'}
                </button>
            </div>
        </div>
    )
}

export default ShareModal