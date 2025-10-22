import axios from 'axios';

const api = axios.create({
  baseURL: './api', // backend server
});

export default api;
