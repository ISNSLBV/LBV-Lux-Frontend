// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // proxy en dev
  withCredentials: true                        // ← envía cookies
});

export default api;
