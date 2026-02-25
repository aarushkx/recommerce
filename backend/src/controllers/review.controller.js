import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Booking from "../models/booking.model.js";
import {
    MIN_MESSAGE_LEN,
    MAX_MESSAGE_LEN,
    MIN_RATING,
    MAX_RATING,
} from "../lib/config.js";
import mongoose from "mongoose";

export const postReview = async (req, res) => {
    const imageLocalPath = req.file?.path;
    try {
        const userId = req.user._id;
        const { bookingId } = req.params;
        const { message } = req.body;
        let { rating } = req.body;

        // Validate booking ID
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: "Invalid booking ID" });
        }

        // Field validation
        // Message
        if (!message)
            return res
                .status(400)
                .json({ message: "Review message is required" });

        if (
            message.length < MIN_MESSAGE_LEN ||
            message.length > MAX_MESSAGE_LEN
        )
            return res.status(400).json({
                message: `Review must be between ${MIN_MESSAGE_LEN} to ${MAX_MESSAGE_LEN} characters`,
            });

        // Ratings
        rating = Number(rating);
        if (rating === undefined || isNaN(rating))
            return res.status(400).json({ message: "Rating is required" });

        if (rating < MIN_RATING || rating > MAX_RATING)
            return res.status(400).json({
                message: `Ratings must be between ${MIN_RATING} and ${MAX_RATING}`,
            });

        // Find booking
        const booking = await Booking.findById(bookingId);
        if (!booking)
            return res.status(404).json({ message: "Booking not found" });

        // Check if seller exists
        const seller = await User.findById(booking.seller);
        if (!seller)
            return res.status(404).json({ message: "Seller not found" });

        // Prevent seller from rating themself
        if (userId.toString() === seller._id.toString())
            return res.status(400).json({
                message: "You cannot post a review for yourself",
            });

        // Prevent unauthorized reviews
        if (!userId.equals(booking.buyer))
            return res.status(403).json({
                message: "You are not authorized to review this product",
            });

        // Prevent reviews for bookings that are not yet complete
        // if (booking.status === "completed")

        //Prevent duplicate reviews
        const existingReview = await Review.findOne({
            reviewer: userId,
            booking: booking._id,
        });
        if (existingReview)
            return res.status(400).json({
                message:
                    "You have already posted a review for this product of this seller",
            });

        // Image
        let image;
        if (imageLocalPath) {
            const uploadedImage = await uploadOnCloudinary(
                imageLocalPath,
                `${APP_NAME.toLowerCase()}/avatars`,
            );

            if (!uploadedImage?.secure_url)
                return res.status(500).json({ message: "Image upload failed" });

            image = {
                public_id: uploadedImage.public_id,
                url: uploadedImage.secure_url,
            };
        }

        // Create new review
        const review = await Review.create({
            reviewer: userId,
            seller: booking.seller,
            booking: bookingId,
            image,
            message,
            rating,
        });

        return res.status(201).json({ review });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: postReview ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        if (imageLocalPath && fs.existsSync(imageLocalPath))
            fs.unlinkSync(imageLocalPath);
    }
};

export const getAllReviews = async (req, res) => {
	
};
