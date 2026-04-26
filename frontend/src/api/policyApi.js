import API_BASE_URL from '../apiConfig';

export const getAllPolicies = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/policies`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching policies:', error);
        throw error;
    }
};

export const getPolicyById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/policies/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching policy with id ${id}:`, error);
        throw error;
    }
};

export const getPoliciesByType = async (type) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/policies/type/${type}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching policies of type ${type}:`, error);
        throw error;
    }
};

export const purchasePolicy = async (purchaseData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/purchases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(purchaseData)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error purchasing policy:', error);
        throw error;
    }
};

export const createPaymentOrder = async (orderData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        if (!response.ok) throw new Error('Order creation failed');
        return await response.json();
    } catch (error) {
        console.error('Error creating payment order:', error);
        throw error;
    }
};

export const verifyPayment = async (verificationData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/payments/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verificationData)
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Payment verification failed');
        }
        return await response.json();
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error;
    }
};
