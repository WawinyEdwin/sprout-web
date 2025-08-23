import axiosClient from "../axiosClient";

export const fetchUrgentInsights = async () => {
  const response = await axiosClient.get("/insights");
  return response.data;
};
