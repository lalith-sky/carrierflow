const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
const getToken = () => localStorage.getItem('cf_token');
const setToken = (token) => localStorage.setItem('cf_token', token);
const removeToken = () => localStorage.removeItem('cf_token');

// Fetch wrapper with auth
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  
  if (res.status === 401) {
    removeToken();
    localStorage.removeItem('cf_user');
    if (!endpoint.includes('/auth/')) {
      window.location.href = '/auth';
    }
    throw new Error('Session expired. Please login again.');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
};

// Auth
export const authAPI = {
  register: (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiFetch('/auth/me'),
};

// Jobs
export const jobsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/jobs${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiFetch(`/jobs/${id}`),
  create: (data) => apiFetch('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/jobs/${id}`, { method: 'DELETE' }),
};

// Applications
export const applicationsAPI = {
  getAll: () => apiFetch('/applications'),
  create: (data) => apiFetch('/applications', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Saved Jobs
export const savedJobsAPI = {
  getAll: () => apiFetch('/saved-jobs'),
  save: (jobId) => apiFetch('/saved-jobs', { method: 'POST', body: JSON.stringify({ jobId }) }),
  unsave: (jobId) => apiFetch(`/saved-jobs/${jobId}`, { method: 'DELETE' }),
};

// Profile
export const profileAPI = {
  get: () => apiFetch('/users/profile'),
  update: (data) => apiFetch('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// Resume
export const resumeAPI = {
  getAll: () => apiFetch('/resumes'),
  upload: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const token = getToken();
    return fetch(`${API_URL}/resumes`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data;
    });
  },
  delete: (id) => apiFetch(`/resumes/${id}`, { method: 'DELETE' }),
};

// Companies
export const companiesAPI = {
  getAll: () => apiFetch('/companies'),
  getById: (id) => apiFetch(`/companies/${id}`),
  update: (id, data) => apiFetch(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Interviews
export const interviewsAPI = {
  getAll: () => apiFetch('/interviews'),
  create: (data) => apiFetch('/interviews', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/interviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Notifications
export const notificationsAPI = {
  getAll: () => apiFetch('/notifications'),
  markRead: (id) => apiFetch(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => apiFetch('/notifications/read-all', { method: 'PUT' }),
};

// Stats
export const statsAPI = {
  getPublic: () => apiFetch('/stats'),
  getRecruiter: () => apiFetch('/recruiter/stats'),
};

// Recruiter
export const recruiterAPI = {
  getJobs: () => apiFetch('/recruiter/jobs'),
  getCandidates: () => apiFetch('/recruiter/candidates'),
  getStats: () => apiFetch('/recruiter/stats'),
};

export { getToken, setToken, removeToken, API_URL };
