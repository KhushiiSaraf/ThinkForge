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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                        <UserPlus size={16} className="text-indigo-500" />
                        Share Note
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>

                <p className="text-xs text-slate-500">
                    Enter the email of the user you want to collaborate with. They must already have a ThinkForge account.
                </p>

                {/* Input */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleShare()}
                    placeholder="collaborator@email.com"
                    className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                    autoFocus
                />

                {/* Error */}
                {error && <p className="text-xs text-red-500">{error}</p>}

                {/* Success */}
                {success && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                        <Check size={12} />
                        {success}
                    </p>
                )}

                {/* Button */}
                <button
                    onClick={handleShare}
                    disabled={loading || !email.trim()}
                    className="bg-slate-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
                >
                    {loading ? 'Sharing...' : 'Share'}
                </button>
            </div>
        </div>
    )
}

export default ShareModal