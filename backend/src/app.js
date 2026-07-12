require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors({
    origin: process.env.FRONTEND_URL, // frontend origin
    credentials: true // allow cookies to be sent
}));
app.use(cookieParser());


// require all routes
const authRouter = require('./routes/auth.routes');
const notesRouter = require('./routes/notes.routes');
const aiRouter = require('./routes/ai.routes');
const searchRouter = require('./routes/search.routes');
const paymentRouter = require('./routes/payment.routes');

// use all routes
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/search', searchRouter);
app.use('/api/payment', paymentRouter);
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});

module.exports = app;