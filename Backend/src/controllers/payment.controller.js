const Razorpay = require('razorpay');
const crypto = require('crypto');
const PurchasedPolicy = require('../models/PurchasedPolicy');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
    try {
        const { amount, policyIdFromAPI } = req.body;

        if (!amount || Number(amount) < 0 || !policyIdFromAPI) {
            return res.status(400).json({ success: false, message: 'Amount and policyIdFromAPI are required' });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: 'Some error occurred while creating Razorpay order' });
        }

        res.status(200).json({
            success: true,
            orderId: order.id,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, message: 'Server Error: Unable to create order', error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purchaseData } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !purchaseData) {
            return res.status(400).json({ success: false, message: 'Missing payment details or purchase data' });
        }

        // Verify the payment
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Invalid signature. Payment verification failed.' });
        }

        // Signature is valid, now save the purchase to MongoDB
        const { userId, policyIdFromAPI, policyName, provider, policyType, premium, coverageAmount } = purchaseData;

        let userExists = null;
        if (userId) {
            userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
        }

        const newPurchase = await PurchasedPolicy.create({
            userId,
            policyIdFromAPI,
            policyName,
            provider,
            policyType,
            premium,
            coverageAmount,
            status: 'active'
        });

        if (userExists) {
            userExists.policies = (userExists.policies || 0) + 1;
            await userExists.save();
        }

        res.status(201).json({ success: true, data: newPurchase, message: 'Policy purchased successfully' });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Server Error: Unable to verify payment', error: error.message });
    }
};
