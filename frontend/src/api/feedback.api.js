import { api } from "./axios";

export const postFeedback = (data) => api.post("/feedback",data);
