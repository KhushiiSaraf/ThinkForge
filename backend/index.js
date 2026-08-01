const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db.config');
const { initSocket } = require('./src/socket');
require('dotenv').config();

connectDB();

require('./src/workers/pdfProcessing.worker'); // starts the BullMQ worker in this same process

const port = process.env.PORT || 7000;
const server = http.createServer(app);
initSocket(server);
server.listen(port, () => console.log(`Server running on port ${port}`));