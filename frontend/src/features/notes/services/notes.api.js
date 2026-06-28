import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

export async function getAllNotes() {
    try {
        const response = await api.get('/api/notes')
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}

export async function getNote(id) {
    try {
        const response = await api.get(`/api/notes/${id}`)
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}

export async function createNote(data) {
    try {
        const response = await api.post('/api/notes', data)
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}

export async function updateNote(id, data) {
    try {
        const response = await api.put(`/api/notes/${id}`, data)
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}

export async function deleteNote(id) {
    try {
        const response = await api.delete(`/api/notes/${id}`)
        return response.data;
    } catch (error) {
        return error.response?.data;
    }
}