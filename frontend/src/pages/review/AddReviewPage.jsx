import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { postReview } from "../../api/reviews.api";
import AddImage from "../../components/product/AddImage";

const AddReviewPage = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(0);
    const [images, setImages] = useState([]);

    const mutation = useMutation({
        mutationFn: postReview,
        onSuccess: () => {
            navigate(-1);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("message", message);
        formData.append("rating", rating);

        if (images.length > 0) {
            formData.append("image", images[0].file);
        }

        mutation.mutate({ sellerId, formData });
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            {/* Title */}
            <h1 className="text-xl font-bold">Write a Review</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                    <p className="text-sm font-semibold mb-2">Rating</p>

                    <div className="rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <input
                                key={star}
                                type="radio"
                                name="rating"
                                className="mask mask-star-2 bg-orange-400"
                                checked={rating === star}
                                onChange={() => setRating(star)}
                            />
                        ))}
                    </div>
                </div>

                {/* Message */}
                <div>
                    <p className="text-sm font-semibold mb-2">Review</p>

                    <textarea
                        className="textarea textarea-bordered w-full h-28"
                        placeholder="Write your experience..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                {/* Images */}
                <div>
                    <p className="text-sm font-semibold mb-2">
                        Add Photos (optional)
                    </p>

                    <AddImage
                        images={images}
                        setImages={setImages}
                        maxImages={1}
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        "Post Review"
                    )}
                </button>

                {/* Error */}
                {mutation.isError && (
                    <p className="text-error text-sm">
                        {mutation.error?.response?.data?.message ||
                            "Something went wrong"}
                    </p>
                )}
            </form>
        </div>
    );
};

export default AddReviewPage;
