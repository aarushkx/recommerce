import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { uploadOnCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";
import {
    PHONE_NUMBER_LEN,
    MAX_EMAIL_LEN,
    MIN_NAME_LEN,
    MAX_NAME_LEN,
    MIN_PASSWORD_LEN,
} from "../lib/config.js";
import { APP_NAME } from "../lib/config.js";
import fs from "fs";

// USER PROFILE
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getUser ::", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const updateProfile = async (req, res) => {
    const avatarLocalPath = req.file?.path;
    try {
        const userId = req.user._id;
        let {
            name,
            email,
            phoneNumber,
            oldPassword,
            newPassword,
            confirmPassword,
            location,
        } = req.body;

        name = name?.trim();
        email = email?.trim().toLowerCase();
        phoneNumber = phoneNumber?.trim();

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Name
        if (name && name !== user.name) {
            if (name.length < MIN_NAME_LEN || name.length > MAX_NAME_LEN)
                return res.status(400).json({
                    message: `Name must be between ${MIN_NAME_LEN} and ${MAX_NAME_LEN} characters`,
                });

            user.name = name;
        }

        // Email
        if (email && email !== user.email) {
            if (email.length > MAX_EMAIL_LEN)
                return res.status(400).json({
                    message: `Email cannot exceed ${MAX_EMAIL_LEN} characters`,
                });

            const emailRegex =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email))
                return res.status(400).json({ message: "Invalid email" });

            const existingEmail = await User.findOne({
                email,
                _id: { $ne: userId },
            });
            if (existingEmail)
                return res
                    .status(400)
                    .json({ message: "Email already in use" });

            user.email = email;
        }

        if (phoneNumber && phoneNumber !== user.phoneNumber) {
            const phoneRegex = new RegExp(`^[0-9]{${PHONE_NUMBER_LEN}}$`);
            if (!phoneRegex.test(phoneNumber))
                return res.status(400).json({
                    message: `Invalid phone number. Should be ${PHONE_NUMBER_LEN} digits`,
                });

            const existingPhoneNumber = await User.findOne({
                phoneNumber,
                _id: { $ne: userId },
            });
            if (existingPhoneNumber)
                return res
                    .status(400)
                    .json({ message: "Phone number already in use" });

            user.phoneNumber = phoneNumber;
        }

        // Password
        if (newPassword) {
            if (!oldPassword)
                return res
                    .status(400)
                    .json({ message: "Old password is required" });

            if (newPassword.length < MIN_PASSWORD_LEN)
                return res.status(400).json({
                    message: `Password must be at least ${MIN_PASSWORD_LEN} characters`,
                });

            const isSame = await bcrypt.compare(oldPassword, user.password);
            if (!isSame)
                return res.status(400).json({ message: "Incorrect password" });

            if (confirmPassword !== newPassword)
                return res.status(400).json({ message: "Password mismatch" });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Location
        if (location) {
            let parsedLocation;
            try {
                parsedLocation = JSON.parse(location);
            } catch {
                return res
                    .status(400)
                    .json({ message: "Invalid location format" });
            }

            const { area, pincode, city, state, country } = parsedLocation;
            if (!area || !pincode || !city || !state || !country)
                return res
                    .status(400)
                    .json({ message: "All location fields are required" });

            user.location = parsedLocation;
        }

        // Avatar
        if (avatarLocalPath) {
            const uploadedAvatar = await uploadOnCloudinary(
                avatarLocalPath,
                `${APP_NAME.toLowerCase()}/avatars`,
            );

            if (!uploadedAvatar?.secure_url)
                return res
                    .status(500)
                    .json({ message: "Avatar upload failed" });

            if (user.avatar.public_id) await deleteFromCloudinary(user.avatar);

            user.avatar = {
                public_id: uploadedAvatar.public_id,
                url: uploadedAvatar.secure_url,
            };
        }

        await user.save();
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            location: user.location,
        });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: updateProfile ::", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    } finally {
        if (avatarLocalPath && fs.existsSync(avatarLocalPath))
            fs.unlinkSync(avatarLocalPath);
    }
};

export const deleteAccount = async (req, res) => {
    // We use MongoDB transaction to ensure atomic deletion of user data
    // Such that all DB changes succeed or rollback together
    // Cloudinary assets are deleted only after commit is successful
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const userId = req.user._id;
        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found" });
        }

        // Collect assets before deletion
        const avatarToDelete = user.avatar;
        const sellerProducts = await Product.find({ seller: userId }).session(
            session,
        );
        const productIds = sellerProducts.map((p) => p._id);
        const productImagesToDelete = [];
        for (const product of sellerProducts) {
            for (const image of product.images || []) {
                productImagesToDelete.push(image);
            }
        }

        // DB operations
        // Delete all bookings where user is buyer or seller
        await Booking.deleteMany(
            { $or: [{ buyer: userId }, { seller: userId }] },
            { session },
        );

        if (productIds.length > 0) {
            // Remove from favorites
            await User.updateMany(
                { favorites: { $in: productIds } },
                { $pull: { favorites: { $in: productIds } } },
                { session },
            );

            // Delete all products
            await Product.deleteMany({ seller: userId }, { session });
        }

        // Delete all reviews of user
        await Review.deleteMany(
            { $or: [{ reviewer: userId }, { seller: userId }] },
            { session },
        );

        await user.deleteOne({ session });

        // Commit transaction
        await session.commitTransaction();

        // Delete from Cloudinary only after transaction has been committed
        if (avatarToDelete?.public_id)
            await deleteFromCloudinary(avatarToDelete);

        for (const image of productImagesToDelete) {
            if (image.public_id) await deleteFromCloudinary(image);
        }

        // Clear cookie
        res.clearCookie("jwt", {
            httpOnly: true,
            // TODO: May need to update the following field for deployment
            sameSite: "strict",
        });

        return res.status(200).json({ message: "Account deleted succesfully" });
    } catch (error) {
        await session.abortTransaction();
        console.log("ERROR :: CONTROLLER :: deleteAccount ::", error);
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        session.endSession();
    }
};

// USER ACTIVITY
export const getUserProducts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ message: "Invalid user ID" });

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Fetch all products listed by user
        const products = await Product.find({ seller: userId })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json(products);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getUserProducts ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ message: "Invalid user ID" });

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Authorization check
        if (req.user._id.toString() !== userId)
            return res
                .status(403)
                .json({ message: "You are not authorized to view this data" });

        // Fetch all the bookings where user is buyer
        const bookings = await Booking.find({ buyer: userId })
            .populate({
                path: "product",
                select: "title price images status category condition",
            })
            .populate({
                path: "seller",
                select: "name email phoneNumber avatar rating",
            })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json(bookings);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getUserBookings ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserSales = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ message: "Invalid user ID" });

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Authorization check
        if (req.user._id.toString() !== userId)
            return res
                .status(403)
                .json({ message: "You are not authorized to view this data" });

        // Fetch all the bookings where user is seller
        const sales = await Booking.find({ seller: userId })
            .populate({
                path: "product",
                select: "title price images status category condition",
            })
            .populate({
                path: "buyer",
                select: "name email phoneNumber avatar rating",
            })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json(sales);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getUserSales ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getReviewsAboutUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ message: "Invalid user ID" });

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const reviews = await Review.find({ seller: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "reviewer",
                select: "name email avatar",
            })
            .lean();

        return res.status(200).json(reviews);
    } catch (error) {
        console.log(
            "ERROR :: CONTROLLER :: getReviewsAboutUser ::",
            error.message,
        );
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
