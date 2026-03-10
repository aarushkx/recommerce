import { api } from "./axios";

export const registerUser = async (formData) => {
    const { data } = api.post("/auth/register", formData);
    return data;
};

export const loginUser = async (formData) => {
    const { data } = api.post("/auth/login", formData);
    return data;
};

export const logoutUser = async () => {
    const { data } = api.post("/auth/logout");
    return data;
};

export const getCurrentUser = () => api.get("/auth/me");
