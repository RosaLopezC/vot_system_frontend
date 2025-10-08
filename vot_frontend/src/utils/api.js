import axios from 'axios';

const API_URL = 'http://31.97.91.123/api';

export const api = {
    // Funciones existentes para supervisores
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
    
    createSupervisor: async (data) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.post(`${API_URL}/usuarios/supervisor/`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Create Supervisor Response:', response); // Debug
            return response;
        } catch (error) {
            console.error('Create Supervisor Error:', error.response || error);
            throw error;
        }
    },
    
    updateSupervisor: async (id, data) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.put(`${API_URL}/usuarios/supervisor/${id}/`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Update Supervisor Response:', response); // Debug
            return response;
        } catch (error) {
            console.error('Update Supervisor Error:', error.response || error);
            throw error;
        }
    },
    
    deleteSupervisor: async (id) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.delete(`${API_URL}/usuarios/supervisor/${id}/delete/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Delete Supervisor Response:', response); // Debug
            return response;
        } catch (error) {
            console.error('Delete Supervisor Error:', error.response || error);
            throw error;
        }
    },
    
    // Nuevas funciones para encargados
    getEncargados: async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.get(`${API_URL}/usuarios/encargados/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Get Encargados Response:', response); // Debug
            return response;
        } catch (error) {
            console.error('Get Encargados Error:', error.response || error);
            throw error;
        }
    },
    
    createEncargado: async (data) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.post(`${API_URL}/usuarios/encargado/`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Create Encargado Response:', response); // Debug
            return response;
        } catch (error) {
            console.error('Create Encargado Error:', error.response || error);
            throw error;
        }
    },
    
    updateEncargado: async (id, data) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.put(`${API_URL}/usuarios/encargado/${id}/`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Update Encargado Response:', response); // Debug
            return response;
        } catch (error) {
            console.error('Update Encargado Error:', error.response || error);
            throw error;
        }
    },
    
    deleteEncargado: async (id) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.delete(`${API_URL}/usuarios/encargado/${id}/delete/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Delete Encargado Response:', response); // Debug
            return response;
        } catch (error) {
            console.error('Delete Encargado Error:', error.response || error);
            throw error;
        }
    }
};