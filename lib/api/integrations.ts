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

export const connectGA = async (workspaceId: string): Promise<string> => {
  const response = await axiosClient.get(
    `/integrations/ga/connect?workspaceId=${workspaceId}`
  );
  return response.data;
};

export const connectGAds = async (workspaceId: string): Promise<string> => {
  const response = await axiosClient.get(
    `/integrations/google-ads/connect?workspaceId=${workspaceId}`
  );
  return response.data;
};

export const connectFacebookAds = async (
  workspaceId: string
): Promise<string> => {
  const response = await axiosClient.get(
    `/integrations/facebook-ads/connect?workspaceId=${workspaceId}`
  );
  return response.data;
};

export const connectStripe = async (
  workspaceId: string,
  apiKey: string
): Promise<string> => {
  const response = await axiosClient.post(
    `/integrations/stripe/connect?workspaceId=${workspaceId}`,
    {
      apiKey,
    }
  );
  return response.data;
};

export const connectQuickbooks = async (
  workspaceId: string
): Promise<string> => {
  const response = await axiosClient.get(
    `/integrations/quickbooks/connect?workspaceId=${workspaceId}`
  );
  return response.data;
};

export const connectSalesforce = async (
  workspaceId: string
): Promise<string> => {
  const response = await axiosClient.get(
    `/integrations/salesforce/connect?workspaceId=${workspaceId}`
  );
  return response.data;
};

export const connectShopify = async (
  shop: string,
  workspaceId: string
): Promise<string> => {
  const response = await axiosClient.get(
    `/integrations/shopify/connect?shop=${shop}&workspaceId=${workspaceId}`
  );
  return response.data;
};

export const connectMailchimp = async (
  workspaceId: string
): Promise<string> => {
  const response = await axiosClient.get(
    `/integrations/mailchimp/connect?workspaceId=${workspaceId}`
  );
  return response.data;
};

export const connectHubspot = async (workspaceId: string): Promise<string> => {
  const response = await axiosClient.get(
    `/integrations/hubspot/connect?workspaceId=${workspaceId}`
  );
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
  return response.data;
};

export const syncIntegration = async (
  workspaceIntegrationId: string,
  workspaceId: string
) => {
  const response = await axiosClient.post(`/integrations/sync`, {
    workspaceId,
    workspaceIntegrationId,
  });
  return response.data;
};

export const submitIntegrationRequest = async (
  workspaceId: string,
  name: string,
  description: string
) => {
  const response = await axiosClient.post(`/integrations/custom`, {
    workspaceId,
    name,
    description,
  });
  return response.data;
};
