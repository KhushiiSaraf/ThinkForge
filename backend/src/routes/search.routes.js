const express = require('express');
const searchRouter = express.Router();
const { searchController } = require('../controllers/search.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

searchRouter.post('/', authMiddleware, searchController);

module.exports = searchRouter;