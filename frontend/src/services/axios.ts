"use client";
import { useAuthStore } from "@/lib/zustand/authStore";
import axios from "axios";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage =
      error.response?.data?.message || "Beklenmeyen bir hata oluştu";
    toast.error(errorMessage);
    console.error(error);
    return Promise.reject(error);
  }
);
export default axiosInstance;
