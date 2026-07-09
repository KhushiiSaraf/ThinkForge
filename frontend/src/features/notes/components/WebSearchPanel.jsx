import { useState, useEffect } from "react"
import { Search, X, ExternalLink, Plus } from "lucide-react"
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
        <div className="w-80 sticky top-16 h-screen bg-white border-l border-slate-200 flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Web Search
                </span>
        
            </div>

            {/* Search Input */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-b border-slate-200">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <Search size={14} className="text-slate-400 shrink-0" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search the web..."
                        className="flex-1 text-sm bg-transparent outline-none"
                        autoFocus
                    />
                </div>
            </form>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
                {loading && (
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
                                <div className="h-4 bg-slate-200 rounded w-full mb-1" />
                                <div className="h-3 bg-slate-100 rounded w-5/6" />
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {!loading && results.length === 0 && !error && (
                    <p className="text-sm text-slate-400 text-center mt-6">
                        Search for anything to get started
                    </p>
                )}

                {results.map((result, index) => (
                    <div key={index} className="flex flex-col gap-1 border-b border-slate-100 pb-4">
                        <span className="text-xs font-semibold text-indigo-600 uppercase">
                            {result.source}
                        </span>
                        <p className="text-sm font-medium text-slate-800 line-clamp-2">
                            {result.title}
                        </p>
                        <p className="text-xs text-slate-500 leading-5 line-clamp-3">
                            {result.snippet}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <button
                                onClick={() => onInsert(result.snippet)}
                                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                <Plus size={12} />
                                Insert snippet
                            </button>
                            <a
                                href={result.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
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