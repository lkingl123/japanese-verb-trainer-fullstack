import axios from 'axios';

// Use relative paths for API calls
// In development with local servers: /api (proxied to http://localhost:3001)
// In production on Vercel: /api (same origin)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message, 'URL:', error.config?.url);
    return Promise.reject(error);
  }
);

// Verb endpoints
export const verbAPI = {
  getAll: () => api.get('/verbs'),
  getRandom: (difficulty, exclude) => 
    api.get('/verbs/random', { 
      params: { difficulty, exclude: exclude?.join(',') } 
    }),
  getDue: () => api.get('/verbs/due'),
  getById: (id) => api.get(`/verbs/${id}`),
  add: (verb) => api.post('/verbs', verb),
  update: (id, verb) => api.put(`/verbs/${id}`, verb),
  delete: (id) => api.delete(`/verbs/${id}`),
};

// Progress endpoints
export const progressAPI = {
  recordAttempt: (verbId, correct) =>
    api.post('/progress/attempt', { verb_id: verbId, correct }),
  getStats: () => api.get('/progress/stats'),
  getVerbProgress: (verbId) => api.get(`/progress/verb/${verbId}`),
  recordSession: (session) => api.post('/progress/session', session),
  resetProgress: () => api.post('/progress/reset'),
};

export default api;
