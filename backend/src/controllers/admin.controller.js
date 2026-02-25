import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Booking from "../models/booking.model.js";
import mongoose from "mongoose";
import { deleteFromCloudinary } from "../lib/cloudinary.js";

export const getAllUsers = async (_req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();
        return res.status(200).json(users);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getAllUsers ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllProducts = async (_req, res) => {
    try {
        const products = await Product.find()
            .populate({
                path: "seller",
                select: "name email phoneNumber avatar location rating",
            })
            .sort({ createdAt: -1 })
            .lean();
        return res.status(200).json(products);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getAllProducts ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const toggleBlockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ message: "Invalid user ID" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role === "admin")
            return res
                .status(403)
                .json({ message: "Cannot block another admin" });

        user.isBlocked = !user.isBlocked;
        await user.save();

        return res.status(200).json({
            message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
        });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: toggleBlockUser ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteProductByAdmin = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid product ID" });

        // Find product
        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                if (image.public_id) {
                    if (image.public_id) await deleteFromCloudinary(image);
                }
            }
        }

        // Remove product from seller's products
        const updatedUser = await User.findByIdAndUpdate(
            product.seller,
            { $pull: { products: productId } },
            { new: true },
        );

        // Remove product from users' favorites
        await User.updateMany(
            { favorites: productId },
            { $pull: { favorites: productId } },
        );

        // If seller has no more products then they are not a seller
        if (updatedUser && updatedUser.products.length === 0) {
            await User.findByIdAndUpdate(product.seller, {
                $set: { isSeller: false },
            });
        }

        // Delete all bookings of the product
        await Booking.deleteMany({ product: productId });

        // Delete the product from DB
        await product.deleteOne();

        return res
            .status(200)
            .json({ message: "Product deleted by admin successfully" });
    } catch (error) {
        console.log(
            "ERROR :: CONTROLLER :: deleteProductByAdmin ::",
            error.message,
        );
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
