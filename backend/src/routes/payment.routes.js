const express = require('express');
const paymentRouter = express.Router();
const { createOrderController, verifyPaymentController } = require('../controllers/payment.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

paymentRouter.post('/create-order', authMiddleware, createOrderController);
paymentRouter.post('/verify', authMiddleware, verifyPaymentController);

module.exports = paymentRouter;