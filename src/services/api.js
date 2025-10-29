import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // backend server
   withCredentials: true, // 👈 send session cookie on every request
});

export default api;
