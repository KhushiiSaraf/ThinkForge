require('dotenv').config();
const connectDB = require('./config/db.config');

connectDB();

require('./workers/pdfProcessing.worker');
console.log('PDF processing worker started');