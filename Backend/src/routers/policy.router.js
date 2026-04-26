const express = require('express');
const router = express.Router();
const { getAllPolicies, getPolicyById, getPoliciesByType } = require('../controllers/policy.controller');

// @route   GET /api/policies
// @desc    Get all policies
router.get('/', getAllPolicies);

// @route   GET /api/policies/type/:type
// @desc    Get policies structured by type
router.get('/type/:type', getPoliciesByType);

// @route   GET /api/policies/:id
// @desc    Get single policy by id
router.get('/:id', getPolicyById);

module.exports = router;
