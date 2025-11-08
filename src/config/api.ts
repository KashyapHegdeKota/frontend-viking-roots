// Backend API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-django-backend.vercel.app';

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/form/register/`,
  LOGIN: `${API_BASE_URL}/form/login/`,
  START: `${API_BASE_URL}/api/questionaire/start/`,
  MESSAGE: `${API_BASE_URL}/api/questionaire/message/`,
  VERIFY_OTP: `${API_BASE_URL}/verify-otp/`,
  RESEND_OTP: `${API_BASE_URL}/resend-otp/`,
  UPLOAD_IMAGE: `${API_BASE_URL}/form/upload-image/`,
  GET_IMAGES: `${API_BASE_URL}/form/images/`,
};
