import { useState } from "react"
import { searchWeb } from "../services/search.api"

export const useSearch = () => {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSearch = async (query) => {
        if (!query.trim()) return
        setLoading(true)
        setError(null)
        try {
            const data = await searchWeb(query)
            if (data?.results) {
                setResults(data.results)
            } else {
                setError(data?.message || 'Search failed')
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Search failed')
        } finally {
            setLoading(false)
        }
    }

    const clearResults = () => {
        setResults([])
        setError(null)
    }

    return { results, loading, error, handleSearch, clearResults }
}