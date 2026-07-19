// backend/src/socket.js
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const IORedis = require('ioredis');

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    });

    // Redis adapter needs two connections: one for publishing, one for subscribing
    const pubClient = new IORedis(process.env.REDIS_URL);
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join-note', (noteId) => {
            socket.join(noteId);
            console.log(`Socket ${socket.id} joined note ${noteId}`);
        });

        socket.on('note-update', ({ noteId, content }) => {
            socket.to(noteId).emit('note-updated', { content });
        });

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