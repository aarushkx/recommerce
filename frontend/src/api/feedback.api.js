import { api } from "./axios";

export const postFeedback = async (formData) => {
    const { data } = await api.post("/feedback", formData);
    return data;
};
