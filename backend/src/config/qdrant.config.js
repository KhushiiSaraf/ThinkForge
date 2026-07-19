const { QdrantClient } = require('@qdrant/js-client-rest');

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

async function ensurePayloadIndexes(collectionName) {
  const fields = ['metadata.noteId', 'metadata.ownerId', 'metadata.pdfDocumentId'];

  for (const field of fields) {
    try {
      await qdrantClient.createPayloadIndex(collectionName, {
        field_name: field,
        field_schema: 'keyword', // exact-match string matching — right type for IDs
      });
    } catch (err) {
      // Safe to ignore "already exists" — this makes the function idempotent,
      // meaning calling it repeatedly (every worker boot) does no harm.
      if (!err.message?.includes('already exists')) {
        console.error(`Failed to create index for ${field}:`, err.message);
      }
    }
  }
}

module.exports = { qdrantClient, ensurePayloadIndexes };