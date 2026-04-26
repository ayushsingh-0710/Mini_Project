const express = require('express');
const router = express.Router();
const { purchasePolicy, getUserPurchases, getAllPurchases } = require('../controllers/purchase.controller');

// @route   POST /api/purchases
// @desc    Purchase a new policy
router.post('/', purchasePolicy);

// @route   GET /api/purchases/user/:userId
// @desc    Get purchases by a specific user
router.get('/user/:userId', getUserPurchases);

// @route   GET /api/purchases
// @desc    Get all purchases (Admin)
router.get('/', getAllPurchases);

module.exports = router;
