import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/user.api";

const useFavorites = () => {
    return useQuery({
        queryKey: ["favorites"],
        queryFn: getFavorites,
    });
};

export default useFavorites;
