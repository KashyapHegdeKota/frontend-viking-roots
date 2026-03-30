// Backend API configuration
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Avoid accidental double slashes in endpoint URLs.
export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '');

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/form/register/`,
  LOGIN: `${API_BASE_URL}/form/login/`,
  PROFILE_STATUS: `${API_BASE_URL}/form/profile/status/`,
  PROFILE: `${API_BASE_URL}/form/profile/`,
  START: `${API_BASE_URL}/api/ai_interview/start/`,
  MESSAGE: `${API_BASE_URL}/api/ai_interview/message/`,
  VERIFY_OTP: `${API_BASE_URL}/verify-otp/`,
  RESEND_OTP: `${API_BASE_URL}/resend-otp/`,
  UPLOAD_IMAGE: `${API_BASE_URL}/form/upload-image/`,
  GET_IMAGES: `${API_BASE_URL}/form/images/`,

  // Social and community
  POSTS: `${API_BASE_URL}/api/community/posts/`,
  CREATE_POST: `${API_BASE_URL}/api/community/posts/create/`,
  SEARCH_USERS: `${API_BASE_URL}/api/community/users/search/`,
  GROUPS: `${API_BASE_URL}/api/community/groups/`,
  CREATE_GROUP: `${API_BASE_URL}/api/community/groups/create/`,
  LIKE_POST: (id: number) => `${API_BASE_URL}/api/community/posts/${id}/like/`,
  POST_COMMENTS: (id: number) => `${API_BASE_URL}/api/community/posts/${id}/comments/`,
} as const;
