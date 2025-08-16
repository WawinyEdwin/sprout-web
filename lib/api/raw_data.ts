import axiosClient from "../axiosClient";

export const fetchWorkspaceRawData = async (workspaceId: string) => {
  const response = await axiosClient.get(`/data/raw/${workspaceId}`);
  return response.data;
};
