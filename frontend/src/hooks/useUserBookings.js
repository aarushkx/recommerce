import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "../api/bookings.api";

const useUserBookings = () => {
    return useQuery({
        queryKey: ["user-bookings"],
        queryFn: getMyBookings,

        // Only return pending bookings
        select: (bookings) => {
            return bookings?.filter((booking) => booking.status === "pending");
        },
    });
};

export default useUserBookings;
