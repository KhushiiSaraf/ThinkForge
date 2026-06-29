const express = require('express');
const aiRouter = express.Router();
const { generateController, rewriteController } = require('../controllers/ai.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

aiRouter.post('/generate', authMiddleware, generateController);
aiRouter.post('/rewrite', authMiddleware, rewriteController);

module.exports = aiRouter;