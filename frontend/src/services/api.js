import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    getUserById: (id) => api.get(`/auth/users/${id}`),
};

// Books API
export const booksAPI = {
    getAll: (params) => api.get('/books', { params }),
    search: (params) => api.get('/books/search', { params }),
    getById: (id) => api.get(`/books/${id}`),
    getMyBooks: () => api.get('/books/my/books'),
    getUserBooks: (userId) => api.get(`/books/user/${userId}`),
    create: (data) => api.post('/books', data),
    update: (id, data) => api.put(`/books/${id}`, data),
    delete: (id) => api.delete(`/books/${id}`),
};

// Trades API
export const tradesAPI = {
    getAll: (params) => api.get('/trades', { params }),
    getById: (id) => api.get(`/trades/${id}`),
    getStats: () => api.get('/trades/stats'),
    create: (data) => api.post('/trades', data),
    update: (id, data) => api.put(`/trades/${id}`, data),
};

// Messages API
export const messagesAPI = {
    getByTrade: (tradeId) => api.get(`/messages/${tradeId}`),
    send: (data) => api.post('/messages', data),
    getUnreadCount: () => api.get('/messages/unread'),
};

// Admin API
export const adminAPI = {
    getUsers: (params) => api.get('/admin/users', { params }),
    getStats: () => api.get('/admin/stats'),
    toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getReports: (params) => api.get('/admin/reports', { params }),
    updateReport: (id, data) => api.put(`/admin/reports/${id}`, data),
    createReport: (data) => api.post('/admin/reports', data),
};

export default api;
