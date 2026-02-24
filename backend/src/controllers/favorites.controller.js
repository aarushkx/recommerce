import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const addToFavorites = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid product ID" });
		
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

        const product = await Product.findById(productId);

        // Check if product is present in database
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        // Check if product is available
        if (product.status !== "available")
            return res
                .status(400)
                .json({ message: "Product is not available" });

        // Check if user is the seller
        if (product.seller.toString() === userId.toString())
            return res.status(400).json({
                message: "You cannot add your own product to your favorites",
            });

        // Push product in user's favorites
        await User.findByIdAndUpdate(userId, {
            $addToSet: { favorites: productId },
        });

        return res
            .status(200)
            .json({ message: "Product added to favorites" });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: addToFavorites ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const removeFromFavorites = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid product ID" });

        // Remove product from favorites
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: productId } },
            { new: true },
        );

        if (!updatedUser)
            return res.status(404).json({ message: "User not found" });

        return res.status(200).json({
            message: "Product removed from favorites",
        });
    } catch (error) {
        console.log(
            "ERROR :: CONTROLLER :: removeFromFavorites ::",
            error.message,
        );
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllFavorites = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .select("favorites -_id")
            .populate({
                path: "favorites",
                select: "title images price status category condition",
            })
            .lean();

        // Check if user exists
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user.favorites);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getAllFavorites ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
