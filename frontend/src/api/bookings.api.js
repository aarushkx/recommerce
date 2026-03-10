import { api } from "./axios";

export const createBooking = async (productId) => {
    const { data } = await api.post(`/bookings/${productId}`);
    return data;
};

export const getMyBookings = async () => {
    const { data } = await api.get("/bookings/my-bookings");
    return data;
};

export const cancelBooking = async (bookingId) => {
    const { data } = await api.patch(`/bookings/${bookingId}/cancel`);
    return data;
};
