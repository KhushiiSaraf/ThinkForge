require('dotenv').config();
const { ensurePayloadIndexes } = require('../src/config/qdrant.config');

(async () => {
  await ensurePayloadIndexes('thinkforge_pdfs');
  console.log('Indexes ensured.');
  process.exit(0);
})();