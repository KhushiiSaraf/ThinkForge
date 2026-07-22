// features/notes/hooks/usePdfRag.js
import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import { uploadPdf, getPdfForNote, askPdfQuestion } from "../services/rag.api"

export const usePdfRag = (noteId) => {
    const [pdfStatus, setPdfStatus] = useState(null) // null | 'processing' | 'ready' | 'failed'
    const [fileName, setFileName] = useState(null)
    const [chunkCount, setChunkCount] = useState(0)
    const [checkingExisting, setCheckingExisting] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [asking, setAsking] = useState(false)
    const [answer, setAnswer] = useState(null)
    const [sources, setSources] = useState([])
    const [error, setError] = useState(null)

    // On mount (or note change), check if this note already has a processed PDF
    useEffect(() => {
        if (!noteId) return

        const checkExisting = async () => {
            setCheckingExisting(true)
            const data = await getPdfForNote(noteId)
            if (data?.exists) {
                setPdfStatus(data.status)
                setFileName(data.fileName)
                setChunkCount(data.chunkCount)
            } else {
                setPdfStatus(null)
            }
            setCheckingExisting(false)
        }

        checkExisting()
    }, [noteId])

    // Called by the socket listener when the worker finishes (or fails) processing
    const handlePdfStatusUpdate = useCallback((payload) => {
        setPdfStatus(payload.status)
        if (payload.status === 'ready') {
            setChunkCount(payload.chunkCount)
            toast.success("PDF ready — ask away!")
        } else if (payload.status === 'failed') {
            toast.error("PDF processing failed. Try uploading again.")
        }
    }, [])

    const handleUploadPdf = async (file) => {
        setUploading(true)
        setError(null)
        try {
            const data = await uploadPdf(noteId, file)
            if (data?.pdfDocumentId) {
                setPdfStatus('processing')
                setFileName(file.name)
                toast.info("PDF uploaded — processing in the background")
            } else {
                setError(data?.message)
                toast.error(data?.message || "Upload failed")
            }
        } catch (err) {
            setError(err.message)
            toast.error("Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleAskQuestion = async (question) => {
        setAsking(true)
        setError(null)
        try {
            const data = await askPdfQuestion(noteId, question)
            if (data?.answer) {
                setAnswer(data.answer)
                setSources(data.sources || [])
            } else {
                setError(data?.message)
                toast.error(data?.message || "Failed to get an answer")
            }
        } catch (err) {
            setError(err.message)
            toast.error("Failed to get an answer")
        } finally {
            setAsking(false)
        }
    }
    const clearAnswer = useCallback(() => {
    setAnswer(null)
    setSources([])
    }, [])

    return {
        pdfStatus,
        fileName,
        chunkCount,
        checkingExisting,
        uploading,
        asking,
        answer,
        sources,
        error,
        handleUploadPdf,
        handleAskQuestion,
        handlePdfStatusUpdate, // pass this into useSocket's onPdfStatus
        clearAnswer,
    }
}