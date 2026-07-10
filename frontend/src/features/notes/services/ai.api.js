import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

export async function generateContent(prompt) {
    try {
        const response = await api.post('/api/ai/generate', { prompt });
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}

export async function rewriteContent(selectedText, instruction) {
    try {
        const response = await api.post('/api/ai/rewrite', {
            selectedText,
            instruction,
        });
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}

export async function generateDiagram(prompt) {
    try {
        const response = await api.post('/api/ai/diagram', { prompt })
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}