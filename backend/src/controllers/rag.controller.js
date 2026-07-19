const multer = require('multer');
const PdfDocument = require('../models/pdfDocument.model');
const Note = require('../models/notes.model');
const { extractTextFromPdf, chunkText, embedAndStore, retrieveRelevantChunks, generateAnswer } = require('../services/rag.service');
const pdfProcessingQueue = require('../queues/pdfProcessing.queue');
const { QDRANT_COLLECTION_NAME } = require('../constants/rag.constants');
const { qdrantClient } = require('../config/qdrant.config');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });


const uploadPdf = async (req, res) => {
  try {
    const { noteId } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No PDF file provided' });

    const note = await Note.findOne({ _id: noteId, owner: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Enforce one-PDF-per-note: wipe any existing PDF's record + vectors before adding the new one
    const existingDocs = await PdfDocument.find({ note: noteId });
    if (existingDocs.length > 0) {
      await qdrantClient.delete(QDRANT_COLLECTION_NAME, {
        filter: {
          must: [{ key: 'metadata.noteId', match: { value: noteId.toString() } }],
        },
      });
      await PdfDocument.deleteMany({ note: noteId });
    }

    const pdfDoc = await PdfDocument.create({
      note: noteId,
      owner: req.user._id,
      fileName: file.originalname,
      qdrantCollection: QDRANT_COLLECTION_NAME,
      status: 'processing',
    });

    await pdfProcessingQueue.add('process-pdf', {
      pdfDocumentId: pdfDoc._id.toString(),
      noteId: noteId.toString(),
      ownerId: req.user._id.toString(),
      fileName: file.originalname,
      fileBuffer: file.buffer.toString('base64'),
    });

    res.status(202).json({ message: 'PDF queued for processing', pdfDocumentId: pdfDoc._id });
 } catch (err) {
  console.error('UPLOAD PDF ERROR:', err); // log the FULL error object, not just err.message
  res.status(500).json({ message: 'Upload failed', error: err.message });
}
};

const askQuestion = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { question } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Make sure this note actually has a ready PDF before we search
    const pdfDoc = await PdfDocument.findOne({
      note: noteId,
      owner: req.user._id,
      status: 'ready',
    }).sort({ createdAt: -1 });

    if (!pdfDoc) {
      return res.status(404).json({ message: 'No processed PDF found for this note' });
    }

    const chunks = await retrieveRelevantChunks({
      question,
      noteId,
      ownerId: req.user._id,
    });

    if (chunks.length === 0) {
      return res.json({ answer: "I couldn't find anything relevant in the document.", sources: [] });
    }

    const answer = await generateAnswer({ question, chunks });

    res.json({
      answer,
      sources: chunks.map((c) => ({ text: c.pageContent.slice(0, 150) + '...' })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to answer question', error: err.message });
  }
};

const getPdfStatus = async (req, res) => {
  const { pdfDocumentId } = req.params;
  const pdfDoc = await PdfDocument.findOne({ _id: pdfDocumentId, owner: req.user._id });
  if (!pdfDoc) return res.status(404).json({ message: 'Not found' });
  res.json({ status: pdfDoc.status, chunkCount: pdfDoc.chunkCount, fileName: pdfDoc.fileName });
};

module.exports = { uploadPdf, uploadMiddleware: upload.single('pdf'), askQuestion, getPdfStatus };

