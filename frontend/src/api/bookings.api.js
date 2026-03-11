import { api } from "./axios";

export const createBooking = async (productId) => {
    const { data } = await api.post(`/bookings/${productId}`);
    return data;
};

export const getMyBookings = async () => {
    const { data } = await api.get("/bookings/my-bookings");
    return data;
};

export const getMySales = async () => {
    const { data } = await api.get("/bookings/my-sales");
    return data;
};

export const confirmBooking = async (bookingId) => {
    const { data } = await api.patch(`/bookings/${bookingId}/confirm`);
    return data;
};

export const cancelBooking = async (bookingId) => {
    const { data } = await api.patch(`/bookings/${bookingId}/cancel`);
    return data;
};

export const completeBooking = async (bookingId) => {
    const { data } = await api.patch(`/bookings/${bookingId}/complete`);
    return data;
};
