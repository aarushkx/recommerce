import { useQuery } from "@tanstack/react-query";
import { getMySales } from "../api/bookings.api";

const useOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: getMySales,
    });
};

export default useOrders;
