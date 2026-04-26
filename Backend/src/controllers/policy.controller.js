const policyApiService = require('../services/policyApi.service');

exports.getAllPolicies = async (req, res) => {
    try {
        const policies = await policyApiService.getAllPolicies();
        res.status(200).json({ success: true, count: policies.length, data: policies });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error: Unable to fetch policies', error: error.message });
    }
};

exports.getPolicyById = async (req, res) => {
    try {
        const policyId = req.params.id;
        const policy = await policyApiService.getPolicyById(policyId);
        
        res.status(200).json({ success: true, data: policy });
    } catch (error) {
        if (error.message === 'Policy not found') {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.getPoliciesByType = async (req, res) => {
    try {
        const type = req.params.type;
        const policies = await policyApiService.getPoliciesByType(type);
        res.status(200).json({ success: true, count: policies.length, data: policies });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
