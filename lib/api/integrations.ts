import axiosClient from "../axiosClient";
import { Integration } from "../types";

export const fetchIntegrations = async (): Promise<Integration[]> => {
  const response = await axiosClient.get("/integrations");
  return response.data;
};

export const fetchUserIntegrations = async (): Promise<Integration[]> => {
  const response = await axiosClient.get("/integrations/me");
  return response.data;
};

export const connectGA = async (): Promise<string> => {
  const response = await axiosClient.get("/integrations/ga/connect");
  return response.data;
};
