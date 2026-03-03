import { api } from "./axios";

export const getProducts = async (params) => {
    const { data } = await api.get("/products", { params });
    return data;
};

export const getProductById = async (productId) => {
    const { data } = await api.get(`/products/${productId}`);
    return data;
};
