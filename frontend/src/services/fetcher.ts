"use client";
import { useAuthStore } from "@/lib/zustand/authStore";
import axios from "axios";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/",
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
      error.response?.data?.message || "Bir sunucu hatası oluştu";
    toast.error(errorMessage);
    console.error(error);
    return Promise.reject(error);
  }
);

const fetcher = async (endpoint: string) => {
  const response = await axiosInstance.get(endpoint);
  return response.data;
};

export default fetcher;
