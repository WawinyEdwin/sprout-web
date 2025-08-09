import axiosClient from "../axiosClient";

export const getWorkspaceSubscription = async (workspaceId: string) => {
  const response = await axiosClient.post("/workspaces/subs", {
    workspaceId,
  });
  return response.data;
};
