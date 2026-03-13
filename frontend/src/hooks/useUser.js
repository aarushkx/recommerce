import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../api/user.api";

const useUser = (userId) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUser(userId),
        enabled: !!userId,

        initialData: () => {
            return queryClient.getQueryData(["user", userId]);
        },
    });
};

export default useUser;
