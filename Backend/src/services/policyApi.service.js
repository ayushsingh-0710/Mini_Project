const axios = require('axios');

// Mock data fallback if no valid external API is configured
const MOCK_POLICIES = [
    {
        id: "POL-1001",
        name: "Comprehensive Health Shield",
        provider: "HealthGuard Plus",
        type: "health",
        premium: 5000,
        coverageAmount: 1000000,
        duration: "1 Year",
        benefits: ["Hospitalization cover", "Pre and post hospitalization", "Cashless treatment", "Emergency medical support", "Free annual health checkup"],
        eligibility: "Age 18-65 years",
        description: "A complete health insurance package covering minor to major illnesses."
    },
    {
        id: "POL-1002",
        name: "Family Health Optima",
        provider: "MediAssist Insurance",
        type: "health",
        premium: 8500,
        coverageAmount: 1500000,
        duration: "1 Year",
        benefits: ["Floater benefit for family", "Maternity cover", "Cashless treatment network of 5000+ hospitals"],
        eligibility: "Family members ranging 91 days to 65 years",
        description: "Ensure the health security of your entire family with a single premium plan."
    },
    {
        id: "POL-2001",
        name: "Secure Drive Auto",
        provider: "RoadAssure Auto",
        type: "vehicle",
        premium: 3200,
        coverageAmount: 500000,
        duration: "1 Year",
        benefits: ["Accident damage coverage", "Third-party liability cover", "Theft protection", "Cashless garage support", "Zero depreciation cover add-on available"],
        eligibility: "Valid driver's license and valid vehicle registration",
        description: "Protect your car from accidents, theft, repairs, and third-party damage with our comprehensive motor insurance."
    },
    {
        id: "POL-3001",
        name: "SafeHome Guardian",
        provider: "ShelterProtect",
        type: "property",
        premium: 4500,
        coverageAmount: 2500000,
        duration: "5 Years",
        benefits: ["Fire damage protection", "Natural disaster coverage", "Burglary and theft cover", "Household items protection", "Alternative accommodation cover"],
        eligibility: "Property owners and legitimate tenants",
        description: "Secure your home and belongings from fire, theft, and natural disasters."
    },
    {
        id: "POL-4001",
        name: "Global Explorer Travel",
        provider: "Wanderlust Insure",
        type: "travel",
        premium: 1500,
        coverageAmount: 5000000,
        duration: "Per Trip (Up to 90 days)",
        benefits: ["Flight delay/cancellation cover", "Loss of baggage cover", "International emergency medical", "Personal liability"],
        eligibility: "Travelers aged 6 months to 70 years",
        description: "Travel the world without worries regarding medical emergencies or lost luggage."
    },
    {
        id: "POL-5001",
        name: "Term Life Supreme",
        provider: "SecureFuture Life",
        type: "life",
        premium: 12000,
        coverageAmount: 10000000,
        duration: "20 Years",
        benefits: ["High coverage at low premiums", "Tax benefits under section 80C", "Critical illness rider availability", "Death benefit payout to nominee"],
        eligibility: "Age 18-50 years, subject to medical screening",
        description: "Secure your family's future even in your absence with significant financial support."
    }
];

class PolicyApiService {
    constructor() {
        this.apiUrl = process.env.POLICY_API_URL || '';
        this.apiKey = process.env.POLICY_API_KEY || '';
        this.useMock = !this.apiUrl;
    }

    async getExternalPolicies() {
        if (this.useMock) {
            return MOCK_POLICIES;
        }

        try {
            const response = await axios.get(`${this.apiUrl}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch from external policy API, using mock data fallback:', error.message);
            return MOCK_POLICIES;
        }
    }

    async getAllPolicies() {
        // Return structured dataset regardless of data source
        const data = await this.getExternalPolicies();
        return data;
    }

    async getPolicyById(id) {
        const policies = await this.getExternalPolicies();
        const policy = policies.find(p => p.id === id);

        if (!policy) {
            throw new Error('Policy not found');
        }
        return policy;
    }

    async getPoliciesByType(type) {
        const policies = await this.getExternalPolicies();
        return policies.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }
}

module.exports = new PolicyApiService();
