import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

export async function searchWeb(query) {
    try {
        const response = await api.post('/api/search', { query })
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}