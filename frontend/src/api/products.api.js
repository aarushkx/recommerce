import { api } from "./axios";

export const createProduct = async (formData) => {
    const { data } = await api.post("/products", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};

export const getProducts = async (params) => {
    const { data } = await api.get("/products", { params });
    return data;
};

export const getProductById = async (productId) => {
    const { data } = await api.get(`/products/${productId}`);
    return data;
};
