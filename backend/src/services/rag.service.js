// backend/src/services/rag.service.js
const { PDFParse } = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { QdrantVectorStore } = require('@langchain/qdrant');
const { QDRANT_COLLECTION_NAME } = require('../constants/rag.constants');
const { qdrantClient, ensurePayloadIndexes } = require('../config/qdrant.config');

// One embeddings instance, reused everywhere
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-embedding-001',
  outputDimensionality: 768,
});

async function extractTextFromPdf(buffer) {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text;
}

async function chunkText(text) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,      // ~characters per chunk, not exact tokens but close enough
    chunkOverlap: 150,    // overlap so context isn't lost at chunk boundaries
  });
  return splitter.createDocuments([text]);
  // returns LangChain "Document" objects: { pageContent, metadata }
}

async function embedAndStore({ chunks, noteId, ownerId, pdfDocumentId }) {
  const enrichedChunks = chunks.map((chunk) => ({
    ...chunk,
    metadata: {
      noteId: noteId.toString(),
      ownerId: ownerId.toString(),
      pdfDocumentId: pdfDocumentId.toString(),
    },
  }));
  await QdrantVectorStore.fromDocuments(enrichedChunks, embeddings, {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName: QDRANT_COLLECTION_NAME,
  });

  await ensurePayloadIndexes(QDRANT_COLLECTION_NAME); // safe to call every time — no-ops if already indexed

  return enrichedChunks.length;
}
// backend/src/services/rag.service.js
// ...keep your existing imports and functions (extractTextFromPdf, chunkText, embedAndStore)...

const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');

// One chat model instance, reused across requests
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-2.5-flash',
  temperature: 0.2, // low temperature = stick close to facts, less "creative" wandering
});

async function retrieveRelevantChunks({ question, noteId, ownerId, topK = 4 }) {
  const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName: QDRANT_COLLECTION_NAME,
  });

  // similaritySearch with a filter — this is the security boundary from earlier
  const results = await vectorStore.similaritySearch(question, topK, {
    must: [
      { key: 'metadata.noteId', match: { value: noteId.toString() } },
      { key: 'metadata.ownerId', match: { value: ownerId.toString() } },
    ],
  });

  return results; // array of { pageContent, metadata }
}

async function generateAnswer({ question, chunks }) {
  const context = chunks.map((c, i) => `[Chunk ${i + 1}]\n${c.pageContent}`).join('\n\n');

  const prompt = `You are answering questions about a PDF document using ONLY the context below.
If the answer is not present in the context, say "I couldn't find that in the document" — do not guess or use outside knowledge.

Context:
${context}

Question: ${question}

Answer:`;

  const response = await llm.invoke(prompt);
  return response.content;
}

module.exports = {
  extractTextFromPdf,
  chunkText,
  embedAndStore,
  retrieveRelevantChunks,
  generateAnswer,
};

