import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api";

export const useAuth = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            try {
                const { data } = await getCurrentUser();
                return data;
            } catch (error) {
                if (error.response?.status === 401) return null;
                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};
