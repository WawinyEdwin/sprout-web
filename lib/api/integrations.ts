import axiosClient from "../axiosClient";
import { Integration, UserIntegration } from "../types";

export const fetchIntegrations = async (): Promise<Integration[]> => {
  const response = await axiosClient.get("/integrations");
  return response.data;
};

export const fetchUserIntegrations = async (): Promise<UserIntegration[]> => {
  const response = await axiosClient.get("/integrations/user");
  return response.data;
};

export const connectGA = async (): Promise<string> => {
  const response = await axiosClient.get("/integrations/ga/connect");
  return response.data;
};

export const connectGAds = async (): Promise<string> => {
  const response = await axiosClient.get("/integrations/google-ads/connect");
  return response.data;
};

export const updateUserIntegration = async (
  integrationId: string,
  config: {
    syncFrequency: string;
    historicalData: string;
  }
): Promise<Integration[]> => {
  const response = await axiosClient.patch(
    `/integrations/user/${integrationId}`,
    config
  );
  console.log(response.data);
  return response.data;
};
