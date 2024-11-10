import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmQxNjMwNTA2MWVlYTgyMGMxNWYzMyIsImVtYWlsIjoiZnVya2FuQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiZnVya2FuIiwiaWF0IjoxNzMxMjQzODkxLCJleHAiOjE3MzE4NDg2OTF9.AvqZNIHUYcyZk4Mb_vg_5goobAoPvMKiS35ayWvYTtM";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const fetcher = (endpoint: string) =>
  axiosInstance.get(endpoint).then((res) => res.data);
export default fetcher;
