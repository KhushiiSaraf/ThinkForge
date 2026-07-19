// backend/src/models/pdfDocument.model.js
const mongoose = require('mongoose');

const pdfDocumentSchema = new mongoose.Schema(
  {
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    status: {
      type: String,
      enum: ['processing', 'ready', 'failed'],
      default: 'processing',
    },
    chunkCount: { type: Number, default: 0 },
    qdrantCollection: { type: String, required: true }, // which Qdrant collection this doc's vectors live in
  },
  { timestamps: true }
);

module.exports = mongoose.model('PdfDocument', pdfDocumentSchema);