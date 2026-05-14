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
    downloadAgent: () => api.get('/agents/download', { responseType: 'blob' }),
    downloadExe: () => api.get('/agents/package/exe', { responseType: 'blob' }),
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

export const emailService = {
    analyze: (data) => api.post('/email/analyze', data),
    getHistory: () => api.get('/email/history'),
};

export const breachService = {
    checkEmail: (email) => api.post('/breach/check-email', { email }),
    checkPassword: (password) => api.post('/breach/check-password', { password }),
    getHistory: () => api.get('/breach/history'),
};

export const intelService = {
    checkHash: (hash) => api.post('/intel/virustotal/hash', { hash }),
    scanUrl: (url) => api.post('/intel/virustotal/url', { url }),
    scanFile: (formData) => api.post('/intel/virustotal/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    checkIP: (ip) => api.post('/intel/abuseipdb/check-ip', { ip }),
    checkEmailExposure: (email) => api.post('/intel/email/site-exposure', { email }),
    getHistory: () => api.get('/intel/history'),
};

export default api;
