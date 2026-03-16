import { useQuery } from "@tanstack/react-query";
import { getReviewsAboutUser } from "../api/reviews.api";

const useSellerReviews = (userId) => {
    return useQuery({
        queryKey: ["reviews-about-user", userId],
        queryFn: () => getReviewsAboutUser(userId),
        enabled: !!userId,
    });
};

export default useSellerReviews;
