import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

export async function uploadPdf(noteId, file) {
    try {
        const formData = new FormData();
        formData.append('pdf', file);
        const response = await api.post(`/api/rag/notes/${noteId}/pdf`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}

export async function getPdfForNote(noteId) {
    try {
        const response = await api.get(`/api/rag/notes/${noteId}/pdf`)
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}

export async function askPdfQuestion(noteId, question) {
    try {
        const response = await api.post(`/api/rag/notes/${noteId}/ask`, { question })
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}