// Backend API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-django-backend.vercel.app';

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/register/`,
  LOGIN: `${API_BASE_URL}/login/`,
};
