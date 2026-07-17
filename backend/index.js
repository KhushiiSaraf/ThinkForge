const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db.config');
const { initSocket } = require('./src/socket');
require('dotenv').config();

const port = process.env.PORT || 7000

connectDB();

// create HTTP server manually instead of app.listen
const server = http.createServer(app);

// attach socket.io to the same server
initSocket(server);

server.listen(port, () => console.log(`Server running on port ${port}`))