import axios from 'axios';

const API_BASE_URL = 'https://cargofirst-dashboard-productio-backend.up.railway.app/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data: { email: string; password: string; role: string; address: string }) =>
    api.post('/auth/signup', data),
  signin: (data: { email: string; password: string }) =>
    api.post('/auth/signin', data),
  getProfile: () =>
    api.get('/auth/profile'),
};

// Dashboard APIs
export const dashboardAPI = {
  createJob: (data: { jobTitle: string; jobDescription: string; lastDateToApply: string; companyName: string }) =>
    api.post('/dashboard/create', data),
  listJobs: () =>
    api.get('/dashboard/list'),
  updateJob: (id: string, data: { jobTitle: string; jobDescription: string; lastDateToApply: string; companyName: string }) =>
    api.put(`/dashboard/update/${id}`, data),
  deleteJob: (id: string) =>
    api.delete(`/dashboard/delete/${id}`),
};
