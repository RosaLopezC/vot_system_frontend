import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const api = {
  // Companies
  getCompanies: () => axios.get(`${API_URL}/companies`),
  createCompany: (data) => axios.post(`${API_URL}/companies`, data),
  updateCompany: (id, data) => axios.put(`${API_URL}/companies/${id}`, data),
  deleteCompany: (id) => axios.delete(`${API_URL}/companies/${id}`),

  // Users
  getUsers: () => axios.get(`${API_URL}/users`),
  createUser: (data) => axios.post(`${API_URL}/users`, data),
  updateUser: (id, data) => axios.put(`${API_URL}/users/${id}`, data),
  deleteUser: (id) => axios.delete(`${API_URL}/users/${id}`),

  // Reports
  getReports: (filters) => axios.get(`${API_URL}/reports`, { params: filters }),
  updateReport: (id, data) => axios.put(`${API_URL}/reports/${id}`, data),
  deleteReport: (id) => axios.delete(`${API_URL}/reports/${id}`),

  // Districts
  getDistricts: () => axios.get(`${API_URL}/districts`),
  createDistrict: (data) => axios.post(`${API_URL}/districts`, data),
  updateDistrict: (id, data) => axios.put(`${API_URL}/districts/${id}`, data),
  deleteDistrict: (id) => axios.delete(`${API_URL}/districts/${id}`),

  // Auth
  loginWithDni: ({ dni, password }) =>
    axios.post(`${API_URL}/auth/login-dni`, { dni, password })
};

export default api;