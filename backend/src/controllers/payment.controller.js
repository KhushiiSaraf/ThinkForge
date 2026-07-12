const Razorpay = require('razorpay');
const crypto = require('crypto');
const userModel = require('../models/user.model');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

/**
 * @route POST /api/payment/create-order
 * @desc Create a Razorpay order
 * @access Private
 */
async function createOrderController(req, res) {
    try {
        const options = {
            amount: 9900, // ₹99 in paise (Razorpay uses paise, 1 rupee = 100 paise)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        }

        const order = await razorpay.orders.create(options)
        res.status(200).json({ order })
    } catch (error) {
        console.error('Error creating order:', error)
        res.status(500).json({ message: 'Failed to create order' })
    }
}

/**
 * @route POST /api/payment/verify
 * @desc Verify payment and upgrade user to Pro
 * @access Private
 */
async function verifyPaymentController(req, res) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user?._id || req.user?.id;

    try {
        // Step 1 — recreate signature using order_id + payment_id + secret
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        // Step 2 — compare with signature Razorpay sent
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed' })
        }

        // Step 3 — upgrade user to pro
        await userModel.findByIdAndUpdate(userId, { plan: 'pro' })

        res.status(200).json({ message: 'Payment verified, plan upgraded to Pro' })
    } catch (error) {
        console.error('Error verifying payment:', error)
        res.status(500).json({ message: 'Payment verification failed' })
    }
}

module.exports = { createOrderController, verifyPaymentController }