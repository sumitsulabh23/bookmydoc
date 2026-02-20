import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

console.log('[API] Initialized with Base URL:', API.defaults.baseURL);

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('meditrack_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
