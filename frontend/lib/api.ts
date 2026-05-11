import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { email: string; username: string; password: string; fullName: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
  refreshToken: (refreshToken: string) => api.post('/api/auth/refresh', { refreshToken }),
  forgotPassword: (email: string) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }) => api.post('/api/auth/reset-password', data),
};

export const courseApi = {
  getAll: (filters?: { difficulty?: string; category?: string; limit?: number; offset?: number }) =>
    api.get('/api/courses', { params: filters }),
  getById: (id: string) => api.get(`/api/courses/${id}`),
  create: (data: any) => api.post('/api/courses', data),
  update: (id: string, data: any) => api.put(`/api/courses/${id}`, data),
  publish: (id: string) => api.post(`/api/courses/${id}/publish`),
};

export const labApi = {
  getAll: (filters?: { difficulty?: string; category?: string }) =>
    api.get('/api/labs', { params: filters }),
  getById: (id: string) => api.get(`/api/labs/${id}`),
  getBySlug: (slug: string) => api.get(`/api/labs/${slug}`),
  submit: (labId: string, data: any) => api.post(`/api/labs/${labId}/submit`, data),
  getSubmissions: (labId: string) => api.get(`/api/labs/${labId}/submissions`),
};

export const userApi = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data: any) => api.put('/api/users/profile', data),
};

export const progressApi = {
  getAll: () => api.get('/api/progress'),
  getCourseProgress: (courseId: string) => api.get(`/api/progress/course/${courseId}`),
  update: (data: any) => api.post('/api/progress/update', data),
  complete: (data: { type: 'lesson' | 'lab'; slug: string }) => api.post('/api/progress/complete', data),
  trackDownload: (noteSlug: string) => api.post('/api/progress/download', { noteSlug }),
};

export const certificateApi = {
  getAll: () => api.get('/api/certificates'),
  verify: (code: string) => api.get(`/api/certificates/verify/${code}`),
};

export const dashboardApi = {
  getData: () => api.get('/api/dashboard'),
};

export const adminApi = {
  getUsers: (limit?: number, offset?: number) =>
    api.get('/api/admin/users', { params: { limit, offset } }),
  getAnalytics: () => api.get('/api/admin/analytics'),
  suspendUser: (userId: string) => api.post(`/api/admin/users/${userId}/suspend`),
  getContent: (type: string) => api.get(`/api/admin/content/${type}`),
  createContent: (type: string, data: any) => api.post(`/api/admin/content/${type}`, data),
  updateContent: (type: string, id: string, data: any) => api.put(`/api/admin/content/${type}/${id}`, data),
  deleteContent: (type: string, id: string) => api.delete(`/api/admin/content/${type}/${id}`),
  seedFallback: () => api.post('/api/admin/seed-fallback'),
};

export const lessonApi = {
  getAll: (params?: { courseSlug?: string }) => api.get('/api/lessons', { params }),
  getBySlug: (slug: string) => api.get(`/api/lessons/${slug}`),
};

export const commandApi = {
  getAll: () => api.get('/api/commands'),
  getBySlug: (slug: string) => api.get(`/api/commands/${slug}`),
  practice: (slug: string, notes?: string) => api.post(`/api/commands/${slug}/practice`, { notes }),
};

export const noteApi = {
  getAll: (params?: { courseSlug?: string }) => api.get('/api/notes', { params }),
  getBySlug: (slug: string) => api.get(`/api/notes/${slug}`),
  downloadPdf: (slug: string) => api.get(`/api/notes/${slug}/pdf`, { responseType: 'blob' }),
  pdfUrl: (slug: string) => `${API_URL}/api/notes/${slug}/pdf`,
};

export const resourceApi = {
  getAll: () => api.get('/api/resources'),
  getBySlug: (slug: string) => api.get(`/api/resources/${slug}`),
  trackDownload: (slug: string) => api.post(`/api/resources/${slug}/download`),
};

export const quizApi = {
  getByCourseSlug: (courseSlug: string) => api.get(`/api/quizzes/course/${courseSlug}`),
  submitAttempt: (data: { quizId: string; answers: number[] }) => api.post('/api/quizzes/attempt', data),
};

export const contentApi = {
  getRoadmap: () => api.get('/api/content/roadmap'),
  getDays: () => api.get('/api/content/days'),
  search: (q: string) => api.get('/api/content/search', { params: { q } }),
};

export default api;
export const apiClient = api;
