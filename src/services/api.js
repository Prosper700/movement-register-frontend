import axios from 'axios';

const api = axios.create({
  baseURL: './api', // backend server
   withCredentials: true, // 👈 send session cookie on every request
});

export default api;
