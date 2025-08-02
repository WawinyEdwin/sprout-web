import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

const supabase =
  typeof window !== "undefined"
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    : null;

axiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sp-access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401s: try refresh and retry
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;

      const { data, error: refreshError } =
        await supabase!.auth.refreshSession();

      if (data.session?.access_token) {
        localStorage.setItem("sp-access-token", data.session.access_token);

        originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`;
        return axiosClient(originalRequest);
      } else {
        localStorage.removeItem("sp-access-token");
        window.location.href = "/auth/signin";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
