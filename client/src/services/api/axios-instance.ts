// src/utils/axios-instance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://your-api-url.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
 
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
