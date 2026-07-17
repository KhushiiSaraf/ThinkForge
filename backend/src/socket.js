const { Server } = require('socket.io');

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // user joins a note's room
        socket.on('join-note', (noteId) => {
            socket.join(noteId);
            console.log(`Socket ${socket.id} joined note ${noteId}`);
        });

        // user sends content update
        socket.on('note-update', ({ noteId, content }) => {
            // broadcast to everyone in the room EXCEPT the sender
            socket.to(noteId).emit('note-updated', { content });
        });

        // user leaves the note
        socket.on('leave-note', (noteId) => {
            socket.leave(noteId);
            console.log(`Socket ${socket.id} left note ${noteId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

function getIO() {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
}

module.exports = { initSocket, getIO };