import { api } from "./axios";

export const getMyBookings = async () => {
    const { data } = await api.get("/bookings/my-bookings");
    return data;
};
export const cancelBooking = async (bookingId) => {
    const { data } = await api.patch(`/bookings/${bookingId}/cancel`);
    return data;
};
