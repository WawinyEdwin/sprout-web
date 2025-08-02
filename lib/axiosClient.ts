// lib/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Attach interceptor for both client and server
axiosClient.interceptors.request.use((config) => {
  // Only try to get token on client side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sp-access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosClient;
