import mongoose, { Schema } from "mongoose";
import imageSchema from "./image.model.js";
import locationSchema from "./location.model.js";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: imageSchema,
        location: locationSchema,
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        isSeller: {
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 0,
        },
        sold: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        purchased: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
