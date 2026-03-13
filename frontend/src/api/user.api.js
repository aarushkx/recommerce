import { api } from "./axios";

export const updateProfile = async (formData) => {
    const { data } = await api.patch("/user/update-profile", formData);
    return data;
};

export const deleteAccount = async () => {
    const { data } = await api.delete("/user/delete-account");
    return data;
};

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

export const getUser = async (userId) => {
    const {data} = await api.get(`/user/${userId}`);
    return data;
}
