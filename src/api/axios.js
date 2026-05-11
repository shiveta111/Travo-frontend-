import axios from 'axios';

const api = axios.create({
  // This will use /api in local dev (proxy) and the full URL in production
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
