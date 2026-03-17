import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const visitorApi = {
  // === TRACKING ===
  trackVisitor: (data) => api.post('/track', data),

  // === BASIC GET APIs ===
  getVisitors: (params = {}) => api.get('/visitors', { params }),
  getVisitorById: (id) => api.get(`/visitors/${id}`),
  
  // === FILTER BY FIELD ===
  getVisitorsByIP: (ip) => api.get(`/visitors/ip/${encodeURIComponent(ip)}`),
  getVisitorsByCountry: (country) => api.get(`/visitors/country/${encodeURIComponent(country)}`),
  getVisitorsByCity: (city) => api.get(`/visitors/city/${encodeURIComponent(city)}`),
  getVisitorsByBrowser: (browser) => api.get(`/visitors/browser/${encodeURIComponent(browser)}`),
  getVisitorsByOS: (os) => api.get(`/visitors/os/${encodeURIComponent(os)}`),
  getVisitorsByDevice: (device) => api.get(`/visitors/device/${encodeURIComponent(device)}`),
  getVisitorsByPage: (params) => api.get('/visitors/page', { params }),
  
  // === DATE FILTERS ===
  getVisitorsByDateRange: (startDate, endDate) => 
    api.get('/visitors/date-range', { params: { startDate, endDate } }),
  getVisitorsByDate: (date) => api.get(`/visitors/date/${date}`),
  getTodayVisitors: () => api.get('/visitors/today'),
  getYesterdayVisitors: () => api.get('/visitors/yesterday'),
  getThisWeekVisitors: () => api.get('/visitors/this-week'),
  getThisMonthVisitors: () => api.get('/visitors/this-month'),

  // === AGGREGATION / ANALYTICS ===
  getTotalCount: () => api.get('/visitors/count/total'),
  getUniqueCount: () => api.get('/visitors/count/unique'),
  
  getAnalyticsByCountry: () => api.get('/visitors/analytics/by-country'),
  getAnalyticsByDevice: () => api.get('/visitors/analytics/by-device'),
  getAnalyticsByBrowser: () => api.get('/visitors/analytics/by-browser'),
  getAnalyticsByOS: () => api.get('/visitors/analytics/by-os'),
  
  getHourlyTraffic: () => api.get('/visitors/analytics/hourly'),
  getDailyTraffic: (days = 30) => api.get('/visitors/analytics/daily', { params: { days } }),
  getTopPages: (limit = 10) => api.get('/visitors/analytics/top-pages', { params: { limit } }),
  getRecentVisitors: (limit = 10) => api.get('/visitors/recent', { params: { limit } }),

  // === SEARCH ===
  searchVisitors: (query, field = null) => 
    api.get('/visitors/search', { params: { q: query, field } }),

  // === EXTERNAL ===
  getIPDetails: (ip) => api.get(`/ip-details/${encodeURIComponent(ip)}`),
};

export default api;