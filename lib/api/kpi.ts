import axiosClient from "../axiosClient";
import { KpiRule } from "../types";

export const fetchKpiRules = async () => {
  const response = await axiosClient.get("/kpi");
  return response.data;
};

export const saveKpiRules = async (rules: Partial<KpiRule[]>) => {
  const response = await axiosClient.post("/kpi", rules);
  return response.data;
};

export const deleteKpiRule = async (ruleId: string) => {
  const response = await axiosClient.delete(`/kpi/${ruleId}`);
  return response.data;
};
