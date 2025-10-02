import axios from 'axios';

const API_URL = 'http://31.97.91.123/api';

export const api = {
    getSupervisors: async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.get(`${API_URL}/usuarios/supervisores/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('API Response:', response); // Debug
            return response;
        } catch (error) {
            console.error('API Error:', error.response || error);
            throw error;
        }
    },
    updateSupervisor: async (id, data) => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.put(`${API_URL}/usuarios/supervisor/${id}/`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
};