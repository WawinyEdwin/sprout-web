import axiosClient from "../axiosClient";

export const manageBilling = async () => {
  const response = await axiosClient.post("/subscriptions/manage");
  return response.data;
};

export const setUpPayment = async (plan: string) => {
  const response = await axiosClient.post("/subscriptions/setup-payment", {
    plan,
  });
  return response.data;
};

export const getWorkspaceSubscription = async () => {
  const response = await axiosClient.post("/subscriptions/me");
  return response.data;
};

export const getWorkspaceUsage = async () => {
  const response = await axiosClient.get(`/subscriptions/usage`);
  return response.data;
};
