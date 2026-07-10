import { useState } from "react"
import { generateContent, rewriteContent, generateDiagram } from "../services/ai.api"

export const useAI = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleGenerate = async (prompt) => {
        setLoading(true)
        setError(null)
        try {
            const data = await generateContent(prompt)
            if (data?.text) {
                return data.text
            } else {
                setError(data?.message || "Generation failed")
                return null
            }
        } catch (error) {
            setError(error.response?.data?.message || "Generation failed")
            return null
        } finally {
            setLoading(false)
        }
    }

    const handleRewrite = async (selectedText, instruction) => {
        setLoading(true)
        setError(null)
        try {
            const data = await rewriteContent(selectedText, instruction)
            if (data?.text) {
                return data.text
            } else {
                setError(data?.message || "Rewrite failed")
                return null
            }
        } catch (error) {
            setError(error.response?.data?.message || "Rewrite failed")
            return null
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateDiagram = async (prompt) => {
        setLoading(true)
        setError(null)
        try {
            const data = await generateDiagram(prompt)
            if (data?.syntax) {
                return data.syntax
            } else {
                setError(data?.message || "Diagram generation failed")
                return null
            }
        } catch (error) {
            setError(error.response?.data?.message || "Diagram generation failed")
            return null
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, handleGenerate, handleRewrite, handleGenerateDiagram }
}