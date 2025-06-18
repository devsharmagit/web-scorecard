// src/services/api-service.ts

import axiosInstance from "./axios-instance";

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

class ApiService {
  // GET Request
  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.get<T>(url);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred during the GET request');
    }
  }

  // POST Request
  async post<T, U>(url: string, data: T): Promise<ApiResponse<U>> {
    try {
      const response = await axiosInstance.post<U>(url, data);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred during the POST request');
    }
  }

  // PUT Request
  async put<T, U>(url: string, data: T): Promise<ApiResponse<U>> {
    try {
      const response = await axiosInstance.put<U>(url, data);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred during the PUT request');
    }
  }

  // DELETE Request
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.delete<T>(url);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred during the DELETE request');
    }
  }
}

export default new ApiService();
