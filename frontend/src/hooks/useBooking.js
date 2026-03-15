import { useQuery } from "@tanstack/react-query";
import { getSingleBooking } from "../api/bookings.api";

const useBooking = (bookingId) => {
    return useQuery({
        queryKey: ["booking", bookingId],
        queryFn: () => getSingleBooking(bookingId),
        enabled: !!bookingId,
    });
};

export default useBooking;
