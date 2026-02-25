import mongoose, { Schema } from "mongoose";
import imageSchema from "./image.model.js";

const reviewSchema = new Schema(
    {
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        image: imageSchema,
        message: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
    },
    { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
