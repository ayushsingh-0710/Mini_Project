const express = require('express');
const router = express.Router();
const { createClaim, getUserClaims } = require('../controllers/claim.controller');

// @route   POST /api/claims
// @desc    Create a new claim
router.post('/', createClaim);

// @route   GET /api/claims/user/:userId
// @desc    Get user specific claims
router.get('/user/:userId', getUserClaims);

module.exports = router;
