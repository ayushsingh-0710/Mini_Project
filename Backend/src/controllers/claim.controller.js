const Claim = require('../models/Claim');

exports.createClaim = async (req, res) => {
  try {
    let { userId, claimType, amount, description, status, policyName, policyId } = req.body;

    // Use JWT decoded User ID if auth middleware sets req.user (fallback to req.body.userId temporarily)
    if (req.user && req.user.id) {
      userId = req.user.id;
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }
    
    if (amount <= 0 || isNaN(amount)) {
      return res.status(400).json({ success: false, message: 'claim amount must be a positive number' });
    }
    
    if (!claimType) {
      return res.status(400).json({ success: false, message: 'claimType is required' });
    }

    if (!description) {
      return res.status(400).json({ success: false, message: 'description is required' });
    }

    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
       return res.status(400).json({ success: false, message: 'invalid status' });
    }

    const newClaim = await Claim.create({
      userId,
      claimType,
      amount: Number(amount),
      description,
      status: status || 'pending',
      policyName,
      policyId
    });

    res.status(201).json({ success: true, data: newClaim, message: 'Claim created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: Unable to create claim', error: error.message });
  }
};

exports.getUserClaims = async (req, res) => {
  try {
    const { userId } = req.params;
    const claims = await Claim.find({ userId }).sort('-date');
    if (!claims) {
      return res.status(404).json({ success: false, message: 'No claims found' });
    }
    res.status(200).json({ success: true, count: claims.length, data: claims });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
