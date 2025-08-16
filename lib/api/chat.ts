import axiosClient from "../axiosClient";

export const askQuestion = async (question: string) => {
  const response = await axiosClient.post("/chat/ask", {
    question,
  });
  return response.data;
};
