// src/utils/axios-instance.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const serverAxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


serverAxiosInstance.interceptors.request.use(
  error => {
    return Promise.reject(error);
  }
);

export default serverAxiosInstance;
