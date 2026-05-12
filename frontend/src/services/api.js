import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (credentials) => api.post('/auth/login', new URLSearchParams(credentials)),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
};

export const dashboardService = {
    getSummary: () => api.get('/dashboard/summary'),
};

export const agentService = {
    getAgents: () => api.get('/agents'),
    registerAgent: (data) => api.post('/agents/register', data),
    deleteAgent: (id) => api.delete(`/agents/${id}`),
};

export const threatService = {
    getThreats: () => api.get('/threats'),
    updateStatus: (id, status) => api.patch(`/threats/${id}/status?status=${status}`),
};

export const malwareService = {
    getAlerts: () => api.get('/agent/malware'),
};

export const logService = {
    getLogs: () => api.get('/agent/logs'),
};

export const reportService = {
    getReports: () => api.get('/reports'),
    generateReport: () => api.post('/reports/generate'),
    downloadReport: (id) => api.get(`/reports/download/${id}`, { responseType: 'blob' }),
};

export default api;
