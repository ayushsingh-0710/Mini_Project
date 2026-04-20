const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/dashboard', adminController.getDashboardData);
router.get('/reports', adminController.getReportData);

// Settings routes
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);
router.put('/settings/password', adminController.updateAdminPassword);

// Policy routes
router.get('/policies', adminController.getPolicies);
router.post('/policies', adminController.createPolicy);
router.put('/policies/:id', adminController.updatePolicy);
router.delete('/policies/:id', adminController.deletePolicy);

// Claim routes
router.get('/claims', adminController.getClaims);
router.post('/claims', adminController.createClaim);
router.put('/claims/:id/status', adminController.updateClaimStatus);

// User routes
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.put('/users/:id/status', adminController.updateUserStatus);

// Agent routes
router.get('/agents', adminController.getAgents);
router.post('/agents', adminController.createAgent);
router.put('/agents/:id', adminController.updateAgent);
router.delete('/agents/:id', adminController.deleteAgent);


module.exports = router;
