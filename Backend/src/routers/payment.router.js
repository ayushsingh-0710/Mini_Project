const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/payment.controller');

// @route   POST /api/payments/create-order
// @desc    Create a Razorpay order
router.post('/create-order', createOrder);

// @route   POST /api/payments/verify-payment
// @desc    Verify Razorpay payment and save purchase
router.post('/verify-payment', verifyPayment);

module.exports = router;
