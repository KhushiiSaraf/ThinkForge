import { useEffect, useState } from 'react'
import { Link as LinkIcon, X } from 'lucide-react'

function LinkDialog({ initialUrl = '', onApply, onClose }) {
    const [url, setUrl] = useState(initialUrl)

    useEffect(() => {
        setUrl(initialUrl)
    }, [initialUrl])

    const handleSubmit = (event) => {
        event.preventDefault()
        onApply(url.trim())
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onMouseDown={onClose}>
            <form
                onSubmit={handleSubmit}
                onMouseDown={(event) => event.stopPropagation()}
                className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900"
            >
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                        <LinkIcon size={17} className="text-indigo-500" />
                        Add link
                    </h2>
                    <button type="button" onClick={onClose} className="rounded-lg p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X size={17} className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    URL
                    <input
                        autoFocus
                        required
                        type="url"
                        value={url}
                        onChange={(event) => setUrl(event.target.value)}
                        placeholder="https://example.com"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
                    />
                </label>

                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                        Cancel
                    </button>
                    <button type="submit" disabled={!url.trim()} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500">
                        Apply link
                    </button>
                </div>
            </form>
        </div>
    )
}

export default LinkDialog