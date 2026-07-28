import { useState, useEffect } from "react"
import { Search, ExternalLink, Plus } from "lucide-react"
import { useSearch } from "../hooks/useSearch"

function WebSearchPanel({ onInsert, initialQuery }) {
    const [query, setQuery] = useState('')
    const { results, loading, error, handleSearch } = useSearch()

    const handleSubmit = (e) => {
        e.preventDefault()
        handleSearch(query)
    }

    useEffect(() => {
    if (initialQuery) {
        setQuery(initialQuery)
    }
    }, [initialQuery])

    return (
        <div className="flex w-full flex-col border-t border-slate-200 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-16 lg:h-screen lg:w-80 lg:border-t-0 lg:border-l">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    Web Search
                </span>
            </div>

            <form onSubmit={handleSubmit} className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                    <Search size={14} className="shrink-0 text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search the web..."
                        className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                        autoFocus
                    />
                </div>
            </form>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-3">
                {loading && (
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="mb-2 h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                                <div className="mb-1 h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                                <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {!loading && results.length === 0 && !error && (
                    <p className="mt-6 text-center text-sm text-slate-400 dark:text-slate-500">
                        Search for anything to get started
                    </p>
                )}

                {results.map((result, index) => (
                    <div key={index} className="flex flex-col gap-1 border-b border-slate-100 pb-4 dark:border-slate-800">
                        <span className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                            {result.source}
                        </span>
                        <p className="line-clamp-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                            {result.title}
                        </p>
                        <p className="line-clamp-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {result.snippet}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                            <button
                                onClick={() => onInsert(result.snippet)}
                                className="flex items-center gap-1 text-xs font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                            >
                                <Plus size={12} />
                                Insert snippet
                            </button>
                            <a
                                href={result.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                <ExternalLink size={12} />
                                Open
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WebSearchPanel