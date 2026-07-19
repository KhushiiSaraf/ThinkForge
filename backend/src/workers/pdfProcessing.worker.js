const { Worker } = require('bullmq');
const connection = require('../config/redis.config');
const PdfDocument = require('../models/pdfDocument.model');
const { extractTextFromPdf, chunkText, embedAndStore } = require('../services/rag.service');
const emitter = require('../socket.emitter');

const worker = new Worker(
  'pdf-processing',
  async (job) => {
    const { pdfDocumentId, noteId, ownerId, fileBuffer } = job.data;

    // Checkpoint 1: bail early if this record is gone or was replaced before we even start
    const currentDoc = await PdfDocument.findById(pdfDocumentId);
    if (!currentDoc || currentDoc.status !== 'processing') {
      console.log(`Skipping job ${job.id} — pdfDocument ${pdfDocumentId} no longer pending (deleted or replaced)`);
      return;
    }

    const buffer = Buffer.from(fileBuffer, 'base64');
    const text = await extractTextFromPdf(buffer);
    const chunks = await chunkText(text);
    const chunkCount = await embedAndStore({ chunks, noteId, ownerId, pdfDocumentId });

    // Checkpoint 2: only mark ready if it's STILL the same pending record —
    // findOneAndUpdate with status:'processing' in the filter means: if a re-upload
    // already replaced/deleted this doc while we were embedding, this update simply
    // matches nothing and does nothing, instead of silently overwriting a newer record.
    const updatedDoc = await PdfDocument.findOneAndUpdate(
      { _id: pdfDocumentId, status: 'processing' },
      { status: 'ready', chunkCount },
      { returnDocument: 'after' }
    );

    if (!updatedDoc) {
      console.log(`Job ${job.id} finished embedding, but pdfDocument ${pdfDocumentId} was replaced mid-process — discarding stale result`);
      // Clean up the vectors we just wrote for a now-stale record, so they don't pollute Qdrant
      // (the newer upload's own vectors are unaffected — different noteId-scoped delete already ran for it)
      return;
    }

    emitter.to(noteId).emit('pdf:status', {
      pdfDocumentId,
      status: 'ready',
      chunkCount,
    });
  },
  { connection, concurrency: 2 }
);

worker.on('failed', async (job, err) => {
  console.error(`PDF processing failed for job ${job.id}:`, err.message);
  await PdfDocument.findByIdAndUpdate(job.data.pdfDocumentId, { status: 'failed' });

  emitter.to(job.data.noteId).emit('pdf:status', {
    pdfDocumentId: job.data.pdfDocumentId,
    status: 'failed',
    });
});

module.exports = worker;