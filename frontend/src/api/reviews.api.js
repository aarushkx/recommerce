import { api } from "./axios";

export const postReview = async ({ sellerId, formData }) => {
    const { data } = await api.post(`/reviews/${sellerId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};

export const getAllReviews = async (buyerId) => {
    const { data } = await api.get(`/reviews/${buyerId}`);
    return data;
};

export const getSingleReview = async (reviewId) => {
    const { data } = await api.get(`/reviews/${reviewId}`);
    return data;
};

export const deleteReview = async (reviewId) => {
    const { data } = await api.delete(`/reviews/${reviewId}`);
    return data;
};

export const getReviewsAboutUser = async (userId) => {
    const { data } = await api.get(`/user/${userId}/reviews`);
    return data;
};
