import { Loader2, Star, MessageSquare } from "lucide-react";
import moment from "moment";
import { useSellerReviews } from "../../hooks";
import Avatar from "../user/Avatar";

const ReviewCard = ({ review }) => {
    const reviewer = review.reviewer;

    return (
        <div className="border border-base-300 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
                <Avatar user={reviewer} size="w-10" />

                <div className="flex-1">
                    <p className="font-semibold">{reviewer?.name}</p>

                    <div className="rating rating-sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <input
                                key={star}
                                type="radio"
                                name={`rating-${review._id}`}
                                className="mask mask-star-2 bg-orange-400"
                                checked={review.rating === star}
                                readOnly
                            />
                        ))}
                    </div>
                </div>

                <span className="text-xs text-base-content/50">
                    {moment(review.createdAt).format("Do MMM YYYY")}
                </span>
            </div>

            <p className="text-sm text-base-content/80">{review.message}</p>

            {review.image?.url && (
                <img
                    src={review.image.url}
                    alt="review"
                    className="rounded-lg max-h-40 object-cover"
                />
            )}
        </div>
    );
};

const ReviewSection = ({ userId }) => {
    const { data: reviews, isLoading } = useSellerReviews(userId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16 gap-2 text-base-content/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading reviews...</span>
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-12 text-base-content/60">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-60" />
                No reviews yet
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Reviews</h3>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                ))}
            </div>
        </div>
    );
};

export default ReviewSection;
