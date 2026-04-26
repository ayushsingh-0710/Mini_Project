const PurchasedPolicy = require('../models/PurchasedPolicy');
const User = require('../models/User');

exports.purchasePolicy = async (req, res) => {
    try {
        const { userId, policyIdFromAPI, policyName, provider, policyType, premium, coverageAmount } = req.body;

        if (!userId || !policyIdFromAPI || !policyName || !provider || !policyType || !premium || !coverageAmount) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // We assume the user sends either a valid _id (ObjectId) or matching custom ID
        // Often _id is better. Let's find if user exists.
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ success: false, message: 'User not found' });
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

        // Optionally increment policy count for the user
        userExists.policies = (userExists.policies || 0) + 1;
        await userExists.save();

        res.status(201).json({ success: true, data: newPurchase, message: 'Policy purchased successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error: Unable to process purchase', error: error.message });
    }
};

exports.getUserPurchases = async (req, res) => {
    try {
        const { userId } = req.params;
        const purchases = await PurchasedPolicy.find({ userId }).sort('-purchaseDate');
        
        res.status(200).json({ success: true, count: purchases.length, data: purchases });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await PurchasedPolicy.find().populate('userId', 'name email').sort('-purchaseDate');
        
        res.status(200).json({ success: true, count: purchases.length, data: purchases });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
