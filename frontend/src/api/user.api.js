import { api } from "./axios";

export const updateProfile = (data) => api.patch("/user/update-profile", data);

export const deleteAccount = () => api.delete("/user/delete-account");

export const addToFavorites = async (productId) => {
    const { data } = await api.post(`/user/favorites/${productId}`);
    return data;
};

export const getFavorites = async () => {
    const { data } = await api.get("/user/favorites");
    return data;
};

export const removeFromFavorites = async (productId) => {
    const { data } = await api.delete(`/user/favorites/${productId}`);
    return data;
};
