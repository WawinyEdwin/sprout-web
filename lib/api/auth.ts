import { AuthPayload, IUser } from "@/lib/types";
import axiosClient from "../axiosClient";

export const updateUser = async (user: Partial<IUser>) => {
  const response = await axiosClient.post("/user/me", user);
  return response.data;
};

export const login = async (formData: AuthPayload) => {
  const response = await axiosClient.post("/auth/login", formData);
  return response.data;
};

export const signupUser = async (formData: AuthPayload) => {
  const response = await axiosClient.post("/auth/signup", formData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosClient.get("/auth/logout");
  return response.data;
};

export const resetPassword = async (password: string, email: string) => {
  const response = await axiosClient.post("/auth/reset-password", {
    password,
    email,
  });
  return response.data;
};

export const forgotPassword = async (email: string, redirectTo: string) => {
  const response = await axiosClient.post("/auth/forgot-password", {
    email,
    redirectTo,
  });
  return response.data;
};
