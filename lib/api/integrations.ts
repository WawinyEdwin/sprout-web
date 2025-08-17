import axiosClient from "../axiosClient";
import { Integration, WorkspaceIntegration } from "../types";

export const fetchIntegrations = async (): Promise<Integration[]> => {
  const response = await axiosClient.get("/integrations");
  return response.data;
};

export const fetchWorkspaceIntegrations = async (): Promise<
  WorkspaceIntegration[]
> => {
  const response = await axiosClient.get(`/integrations/workspaces`);
  return response.data;
};

export const connectGA = async (): Promise<string> => {
  const response = await axiosClient.get(`/integrations/ga/connect`);
  return response.data;
};

export const connectGAds = async (): Promise<string> => {
  const response = await axiosClient.get(`/integrations/google-ads/connect`);
  return response.data;
};

export const connectFacebookAds = async (): Promise<string> => {
  const response = await axiosClient.get(`/integrations/facebook-ads/connect`);
  return response.data;
};

export const connectStripe = async (apiKey: string): Promise<string> => {
  const response = await axiosClient.post(`/integrations/stripe/connect`, {
    apiKey,
  });
  return response.data;
};

export const connectQuickbooks = async (): Promise<string> => {
  const response = await axiosClient.get(`/integrations/quickbooks/connect`);
  return response.data;
};

export const connectSalesforce = async (): Promise<string> => {
  const response = await axiosClient.get(`/integrations/salesforce/connect`);
  return response.data;
};

export const connectShopify = async (shop: string): Promise<string> => {
  const response = await axiosClient.get(
    `/integrations/shopify/connect?shop=${shop}`
  );
  return response.data;
};

export const connectMailchimp = async (): Promise<string> => {
  const response = await axiosClient.get(`/integrations/mailchimp/connect`);
  return response.data;
};

export const connectHubspot = async (): Promise<string> => {
  const response = await axiosClient.get(`/integrations/hubspot/connect`);
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
    `/integrations/workspaces/${integrationId}`,
    config
  );
  return response.data;
};

export const syncIntegration = async (workspaceIntegrationId: string) => {
  const response = await axiosClient.post(`/integrations/sync`, {
    workspaceIntegrationId,
  });
  return response.data;
};

export const submitIntegrationRequest = async (
  name: string,
  description: string
) => {
  const response = await axiosClient.post(`/integrations/custom`, {
    name,
    description,
  });
  return response.data;
};

export const fetchWorkspaceRawData = async () => {
  const response = await axiosClient.get(`/integrations/data/raw`);
  return response.data;
};
