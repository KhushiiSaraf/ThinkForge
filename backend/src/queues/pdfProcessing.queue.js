const { Queue } = require('bullmq');
const connection = require('../config/redis.config');

const pdfProcessingQueue = new Queue('pdf-processing', { connection });

module.exports = pdfProcessingQueue;