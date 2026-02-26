import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import {
    APP_NAME,
    MIN_MESSAGE_LEN,
    MAX_MESSAGE_LEN,
    MIN_RATING,
    MAX_RATING,
} from "../lib/config.js";
import mongoose from "mongoose";
import { uploadOnCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";
import fs from "fs";

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
        if (!message?.trim())
            return res
                .status(400)
                .json({ message: "Review message is required" });

        if (
            message.trim().length < MIN_MESSAGE_LEN ||
            message.trim().length > MAX_MESSAGE_LEN
        )
            return res.status(400).json({
                message: `Review must be between ${MIN_MESSAGE_LEN} to ${MAX_MESSAGE_LEN} characters`,
            });

        // Ratings
        rating = Number(rating);
        if (isNaN(rating))
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
        const isAllowed = await Booking.findOne({
            seller: seller,
            buyer: userId,
        });
        if (!isAllowed)
            return res.status(403).json({
                message: "You are not authorized to review this product",
            });

        // Prevent duplicate reviews
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

        // Re-calculate seller's average rating
        const result = await Review.aggregate([
            {
                $match: { seller: booking.seller },
            },
            {
                $group: {
                    _id: "$seller",
                    avgRating: { $avg: "$rating" },
                },
            },
        ]);

        const avgRating =
            result.length > 0 ? Number(result[0].avgRating.toFixed(1)) : 0;

        await User.findByIdAndUpdate(seller._id, {
            rating: avgRating,
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
    try {
        const reviewerId = req.user._id;

        // Get all reviews written by user
        const reviews = await Review.find({ reviewer: reviewerId })
            .sort({
                createdAt: -1,
            })
            .populate("seller", "name avatar rating")
            .populate({
                path: "booking",
                populate: {
                    path: "product",
                    select: "title",
                },
            })
            .lean();
        return res.status(200).json({ reviews });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getAllReviews ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSingleReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        // Validate review ID
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: "Invalid review ID" });
        }

        // Get single review
        const review = await Review.findById(reviewId)
            .populate("reviewer", "name avatar")
            .populate("seller", "name avatar rating")
            .populate({
                path: "booking",
                populate: {
                    path: "product",
                    select: "title",
                },
            })
            .lean();

        // Check if review exists
        if (!review)
            return res.status(404).json({ message: "Review not found" });

        return res.status(200).json({ review });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getSingleReview ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const reviewerId = req.user._id;
        const { reviewId } = req.params;

        // Validate review ID
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: "Invalid review ID" });
        }

        // Find review
        const review = await Review.findById(reviewId);
        if (!review)
            return res.status(404).json({ message: "Review not found" });

        // Check authorization
        if (review.reviewer.toString() !== reviewerId.toString())
            return res.status(403).json({
                message: "You are not authorized to delete this review",
            });

        // Delete image from Cloudinary
        if (review.image?.public_id) {
            await deleteFromCloudinary(review.image);
        }

        const sellerId = review.seller;

        // Delete review
        await review.deleteOne();

        // Re-calculate seller's rating
        const result = await Review.aggregate([
            {
                $match: { seller: sellerId },
            },
            {
                $group: {
                    _id: "$seller",
                    avgRating: { $avg: "$rating" },
                },
            },
        ]);

        const avgRating =
            result.length > 0 ? Number(result[0].avgRating.toFixed(1)) : 0;

        await User.findByIdAndUpdate(sellerId, {
            rating: avgRating,
        });

        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: deleteReview ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
