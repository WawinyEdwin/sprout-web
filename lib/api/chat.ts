import axiosClient from "../axiosClient";

export const askQuestion = async (workspaceId: string, question: string) => {
  const response = await axiosClient.post("/chat/ask", {
    workspaceId,
    question,
  });
  return response.data;
};
