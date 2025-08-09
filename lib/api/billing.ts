import axiosClient from "../axiosClient";

export const manageBilling = async (workspaceId: string) => {
  const response = await axiosClient.post("/subscriptions/manage", {
    workspaceId,
  });
  return response.data;
};

export const setUpPayment = async (workspaceId: string, plan: string) => {
  const response = await axiosClient.post("/subscriptions/setup-payment", {
    workspaceId,
    plan,
  });
  return response.data;
};

export const getWorkspaceSubscription = async (workspaceId: string) => {
  const response = await axiosClient.post("/subscriptions/me", {
    workspaceId,
  });
  return response.data;
};
