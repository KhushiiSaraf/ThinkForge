import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

export async function createOrder() {
    try {
        const response = await api.post('/api/payment/create-order')
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}

export async function verifyPayment(paymentData) {
    try {
        const response = await api.post('/api/payment/verify', paymentData)
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}