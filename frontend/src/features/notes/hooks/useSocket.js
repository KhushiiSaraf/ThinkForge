import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export const useSocket = (noteId, user, editor, { onPdfStatus } = {}) => {
    const socketRef = useRef(null)
    const isRemoteUpdate = useRef(false) //ref to track if we're currently applying a remote update
 
    useEffect(() => {
        if (!noteId || !user) return

        socketRef.current = io(import.meta.env.VITE_API_URL, {
            withCredentials: true
        })

        const socket = socketRef.current

        socket.emit('join-note', noteId)
        console.log('Joined note room:', noteId)

        socket.on('note-updated', ({ content }) => {
            if (editor && content) {
                isRemoteUpdate.current = true // set flag
                editor.commands.setContent(content, false)
                isRemoteUpdate.current = false // reset flag
            }
        })
        // listen for PDF processing updates from the worker (relayed via Redis)
        socket.on('pdf:status', (payload) => {
            onPdfStatus?.(payload)
        })

        return () => {
            socket.emit('leave-note', noteId)
            socket.disconnect()
        }
    }, [noteId, user, editor])

    const emitUpdate = (content) => {
        if (socketRef.current && !isRemoteUpdate.current) { // only emit if not a remote update
            socketRef.current.emit('note-update', { noteId, content })
        }
    }

    return { emitUpdate }
}