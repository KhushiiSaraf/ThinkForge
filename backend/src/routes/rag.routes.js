const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const requirePro = require('../middleware/pro.middleware');
const { uploadPdf, uploadMiddleware, askQuestion, getPdfStatus } = require('../controllers/rag.controller');

router.post('/notes/:noteId/pdf', authMiddleware, requirePro, uploadMiddleware, uploadPdf);
router.post('/notes/:noteId/ask', authMiddleware, requirePro, askQuestion);
router.get('/pdf/:pdfDocumentId/status', authMiddleware, getPdfStatus);

module.exports = router;