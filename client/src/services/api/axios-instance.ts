// src/utils/axios-instance.ts
import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed/';
const API_KEY = import.meta.env.VITE_API_KEY;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  config => {
    config.params = {
      ...config.params,
      key: API_KEY
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
