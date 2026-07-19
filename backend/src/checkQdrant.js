// backend/checkQdrant.js  (temporary debug script, delete after)
require('dotenv').config();
const { QdrantClient } = require('@qdrant/js-client-rest');

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

(async () => {
  const result = await client.scroll('thinkforge_pdfs', { limit: 1, with_payload: true });
  console.log(JSON.stringify(result.points, null, 2));
})();