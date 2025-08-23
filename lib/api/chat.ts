import axiosClient from "../axiosClient";

export const askQuestion = async (question: string) => {
  const response = await axiosClient.post("/chat/ask", {
    question,
  });
  return response.data;
};

export const fetchRecentQuestion = async () => {
  const response = await axiosClient.get("/chat/recent");
  return response.data;
};
