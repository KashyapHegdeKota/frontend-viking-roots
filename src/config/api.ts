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
  // Group endpoints
  LIST_USER_GROUPS: (username: string) => `${API_BASE_URL}/form/groups/${username}/`,
  CREATE_GROUP: `${API_BASE_URL}/form/groups/create/`,
  GROUP_DETAIL: (groupId: number) => `${API_BASE_URL}/form/group/${groupId}/`,
  UPDATE_GROUP: (groupId: number) => `${API_BASE_URL}/form/group/${groupId}/update/`,
  DELETE_GROUP: (groupId: number) => `${API_BASE_URL}/form/group/${groupId}/delete/`,
  // Group membership endpoints
  ADD_MEMBER: (groupId: number) => `${API_BASE_URL}/form/group/${groupId}/members/add/`,
  REMOVE_MEMBER: (groupId: number) => `${API_BASE_URL}/form/group/${groupId}/members/remove/`,
  ASSIGN_ADMIN: (groupId: number) => `${API_BASE_URL}/form/group/${groupId}/members/assign-admin/`,
  // Group invite endpoints
  PENDING_INVITES: `${API_BASE_URL}/form/groups/invites/`,
  ACCEPT_INVITE: (groupId: number) => `${API_BASE_URL}/form/group/${groupId}/invites/accept/`,
  REJECT_INVITE: (groupId: number) => `${API_BASE_URL}/form/group/${groupId}/invites/reject/`,
  // Group post endpoints
  GROUP_POSTS: (groupId: number) => `${API_BASE_URL}/form/group/${groupId}/posts/`,
  CREATE_POST: (groupId: number) => `${API_BASE_URL}/form/group/${groupId}/posts/create/`,
  DELETE_POST: (groupId: number, postId: number) => `${API_BASE_URL}/form/group/${groupId}/posts/${postId}/delete/`,
};
