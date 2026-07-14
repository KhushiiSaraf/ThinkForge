import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export const useSocket = (noteId, user, editor) => {
    const socketRef = useRef(null)

    useEffect(() => {
        // only connect if user is Pro
        if (!noteId || !user || user.plan !== 'pro') return

        // connect to backend socket server
        socketRef.current = io(import.meta.env.VITE_API_URL, {
            withCredentials: true
        })

        const socket = socketRef.current

        // join this note's room
        socket.emit('join-note', noteId)
        console.log('Joined note room:', noteId)

        // listen for updates from other users
        socket.on('note-updated', ({ content }) => {
            if (editor && content) {
                // update editor without triggering onUpdate (to avoid infinite loop)
                editor.commands.setContent(content, false)
            }
        })

        // cleanup when user leaves the note
        return () => {
            socket.emit('leave-note', noteId)
            socket.disconnect()
        }
    }, [noteId, user, editor])

    // function to emit content changes
    const emitUpdate = (content) => {
        if (socketRef.current && user?.plan === 'pro') {
            socketRef.current.emit('note-update', { noteId, content })
        }
    }

    return { emitUpdate }
}