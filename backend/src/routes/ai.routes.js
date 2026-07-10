const express = require('express');
const aiRouter = express.Router();
const { generateController, rewriteController, generateDiagramController } = require('../controllers/ai.controller');
const { authMiddleware } = require('../middleware/auth.middleware');


aiRouter.post('/generate', authMiddleware, generateController);
aiRouter.post('/rewrite', authMiddleware, rewriteController);
aiRouter.post('/diagram', authMiddleware, generateDiagramController);

module.exports = aiRouter;