import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Products API
export const productsAPI = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    search: (query) => api.get(`/products/search?q=${query}`),
    getLowStock: () => api.get('/products/low-stock'),
    sendLowStockAlerts: () => api.post('/products/low-stock/alerts'),
};

// Suppliers API
export const suppliersAPI = {
    getAll: () => api.get('/suppliers'),
    getById: (id) => api.get(`/suppliers/${id}`),
    create: (data) => api.post('/suppliers', data),
    update: (id, data) => api.put(`/suppliers/${id}`, data),
    delete: (id) => api.delete(`/suppliers/${id}`),
    search: (query) => api.get(`/suppliers/search?q=${query}`),
};

// Sales API
export const salesAPI = {
    getAll: () => api.get('/sales'),
    getById: (id) => api.get(`/sales/${id}`),
    create: (data) => api.post('/sales', data),
    delete: (id) => api.delete(`/sales/${id}`),
    getByDateRange: (startDate, endDate) => 
        api.get(`/sales/date-range?startDate=${startDate}&endDate=${endDate}`),
    getTopProducts: (limit = 10) => api.get(`/sales/top-products?limit=${limit}`),
};

// Reports API
export const reportsAPI = {
    getDashboard: () => api.get('/reports/dashboard'),
    getDailyProfit: (date) => api.get(`/reports/daily?date=${date}`),
    getMonthlyProfit: (year, month) => 
        api.get(`/reports/monthly?year=${year}&month=${month}`),
    getOverallProfit: () => api.get('/reports/overall'),
};

// Health check
export const healthAPI = {
    check: () => api.get('/health'),
    testEmail: () => api.get('/test-email'),
};

export default api;