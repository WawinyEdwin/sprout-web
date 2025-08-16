import axiosClient from "../axiosClient";

export const fetchWorkspaceRawData = async () => {
  const response = await axiosClient.get(`/data/raw`);
  return response.data;
};
