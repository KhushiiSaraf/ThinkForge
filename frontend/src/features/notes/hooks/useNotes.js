import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { getAllNotes, getNote, createNote, updateNote, deleteNote } from "../services/notes.api"

export const useNotes = () => {
    const [notes, setNotes] = useState([])
    const [currentNote, setCurrentNote] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleGetAllNotes = async () => {
        setLoading(true)
        try {
            const data = await getAllNotes()
            if (data?.notes) {
                setNotes(data.notes)
            } else {
                setError(data?.message)
            }
        } catch (error) {
            setError(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGetNote = async (id) => {
        setLoading(true)
        try {
            const data = await getNote(id)
            if (data?.note) {
                setCurrentNote(data.note)
            } else {
                setError(data?.message)
            }
        } catch (error) {
            setError(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateNote = async () => {
        setLoading(true)
        try {
            const data = await createNote({ title: 'Untitled', content: {} })
            if (data?.note) {
                setNotes(prev => [data.note, ...prev])
                navigate(`/notes/${data.note._id}`)
                toast.success("Note created")
            } else {
                setError(data?.message)
            }
        } catch (error) {
            setError(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateNote = async (id, { title, content }) => {
        try {
            const data = await updateNote(id, { title, content })
            if (data?.note) {
                setCurrentNote(data.note)
            }
        } catch (error) {
            console.error("Auto-save failed", error)
        }
    }

    const handleDeleteNote = async (id) => {
        setLoading(true)
        try {
            const data = await deleteNote(id)
            if (data?.success) {
                setNotes(prev => prev.filter(note => note._id !== id))
                navigate('/dashboard')
                toast.success("Note deleted")
            } else {
                setError(data?.message)
            }
        } catch (error) {
            setError(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    return {
        notes,
        currentNote,
        loading,
        error,
        handleGetAllNotes,
        handleGetNote,
        handleCreateNote,
        handleUpdateNote,
        handleDeleteNote
    }
}