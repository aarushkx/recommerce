import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../lib/cloudinary.js";
import { APP_NAME } from "../lib/config.js";
import {
    MIN_TITLE_LEN,
    MAX_TITLE_LEN,
    MIN_DESCRIPTION_LEN,
    MAX_DESCRIPTION_LEN,
    VALID_CONDITIONS,
    MAX_CATEGORY_LENGTH,
    VALID_STATUS,
} from "../lib/config.js";
import fs from "fs";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
    const imageFiles = req.files || [];
    try {
        let { title, description, price, category, tags, condition, location } =
            req.body;

        // Sanitization
        title = title?.trim();
        description = description?.trim();
        category = category?.trim();
        tags = tags?.trim();
        condition = condition?.trim();

        // Field validation
        // Title
        if (!title)
            return res.status(400).json({ message: "Title is required" });

        if (title.length < MIN_TITLE_LEN || title.length > MAX_TITLE_LEN)
            return res.status(400).json({
                message: `Title must be between ${MIN_TITLE_LEN} and ${MAX_TITLE_LEN} characters`,
            });

        // Description
        if (!description)
            return res.status(400).json({ message: "Description is required" });

        if (
            description.length < MIN_DESCRIPTION_LEN ||
            description.length > MAX_DESCRIPTION_LEN
        )
            return res.status(400).json({
                message: `Description must be between ${MIN_DESCRIPTION_LEN} and ${MAX_DESCRIPTION_LEN} characters`,
            });

        // Price
        if (price === undefined || price === null) {
            return res.status(400).json({ message: "Price is required" });
        }

        const numericPrice = Number(price);
        if (price === "" || isNaN(numericPrice))
            return res.status(400).json({ message: "Invalid price" });

        if (numericPrice < 0)
            return res
                .status(400)
                .json({ message: "Price must be a non-negative number" });

        // Category
        if (!category)
            return res.status(400).json({ message: "Category is required" });

        if (category.length > MAX_CATEGORY_LENGTH)
            return res.status(400).json({
                message: `Category cannot exceed ${MAX_CATEGORY_LENGTH} characters`,
            });

        // Condition
        if (!condition)
            return res.status(400).json({ message: "Condition is required" });

        if (!VALID_CONDITIONS.includes(condition))
            return res.status(400).json({
                message: `Invalid condition. Allowed values are: ${VALID_CONDITIONS.join(", ")}`,
            });

        // Tags
        const tagsArr =
            typeof tags === "string"
                ? tags
                      .split(/\s+/)
                      .filter((t) => t.startsWith("#"))
                      .map((t) => t.slice(1))
                : [];
        tags = tagsArr;

        // Location
        if (!location)
            return res.status(400).json({ message: "Location is required" });

        let parsedLocation;
        try {
            parsedLocation = JSON.parse(location);
        } catch {
            return res.status(400).json({ message: "Invalid location format" });
        }

        // Images
        if (imageFiles.length === 0)
            return res
                .status(400)
                .json({ message: "At least one product image is required" });

        const uploadedImages = [];
        for (const file of imageFiles) {
            const uploaded = await uploadOnCloudinary(
                file.path,
                `${APP_NAME.toLowerCase()}/products`,
            );

            if (!uploaded?.secure_url)
                return res.status(500).json({ message: "Image upload failed" });

            uploadedImages.push({
                public_id: uploaded.public_id,
                url: uploaded.secure_url,
            });
        }

        // Create product
        const product = await Product.create({
            seller: req.user._id,
            title,
            description,
            price,
            category,
            tags,
            condition,
            location: parsedLocation,
            images: uploadedImages,
        });

        // Push product into user's products
        const user = await User.findByIdAndUpdate(req.user._id, {
            $push: { products: product._id },
        });
        if (!user) {
            await Product.findByIdAndDelete(product._id);
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(201).json(product);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: createProduct ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        // Cleanup locally uploaded files
        imageFiles.forEach((file) => {
            if (file.path) fs.unlinkSync(file.path);
        });
    }
};

export const updateProduct = async (req, res) => {
    const imageFiles = req.files || [];
    try {
        const { productId } = req.params;

        // Field validation
        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid product ID" });

        // Find product
        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        if (product.seller.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Not authorized" });

        let {
            title,
            description,
            price,
            category,
            tags,
            condition,
            location,
            status,
        } = req.body;

        // Sanitization
        title = title?.trim();
        description = description?.trim();
        category = category?.trim();
        tags = tags?.trim();
        condition = condition?.trim();

        // Title
        if (title !== undefined) {
            if (!title)
                return res
                    .status(400)
                    .json({ message: "Title cannot be empty" });

            if (title.length < MIN_TITLE_LEN || title.length > MAX_TITLE_LEN)
                return res.status(400).json({
                    message: `Title must be between ${MIN_TITLE_LEN} and ${MAX_TITLE_LEN} characters`,
                });

            product.title = title;
        }

        // Description
        if (description !== undefined) {
            if (!description)
                return res
                    .status(400)
                    .json({ message: "Description cannot be empty" });

            if (
                description.length < MIN_DESCRIPTION_LEN ||
                description.length > MAX_DESCRIPTION_LEN
            )
                return res.status(400).json({
                    message: `Description must be between ${MIN_DESCRIPTION_LEN} and ${MAX_DESCRIPTION_LEN} characters`,
                });

            product.description = description;
        }

        // Price
        if (price !== undefined) {
            const numericPrice = Number(price);
            if (price === "" || isNaN(numericPrice))
                return res.status(400).json({ message: "Invalid price" });

            if (numericPrice < 0)
                return res.status(400).json({
                    message: "Price must be a non-negative number",
                });

            product.price = numericPrice;
        }

        // Category
        if (category !== undefined) {
            if (!category)
                return res
                    .status(400)
                    .json({ message: "Category cannot be empty" });

            if (category.length > MAX_CATEGORY_LENGTH)
                return res.status(400).json({
                    message: `Category cannot exceed ${MAX_CATEGORY_LENGTH} characters`,
                });

            product.category = category;
        }

        // Condition
        if (condition !== undefined) {
            if (!VALID_CONDITIONS.includes(condition))
                return res.status(400).json({
                    message: `Invalid condition. Allowed values are: ${VALID_CONDITIONS.join(", ")}`,
                });

            product.condition = condition;
        }

        // Status
        if (status !== undefined) {
            if (!VALID_STATUS.includes(status))
                return res.status(400).json({
                    message: `Invalid status. Allowed values are: ${VALID_STATUS.join(", ")}`,
                });

            product.status = status;
        }

        // Tags
        if (tags !== undefined) {
            const tagsArr =
                typeof tags === "string"
                    ? tags
                          .split(/\s+/)
                          .filter((t) => t.startsWith("#"))
                          .map((t) => t.slice(1))
                    : [];

            product.tags = tagsArr;
        }

        // Location
        if (location !== undefined) {
            try {
                product.location = JSON.parse(location);
            } catch {
                return res
                    .status(400)
                    .json({ message: "Invalid location format" });
            }
        }

        // TODO: Add option to upload (append) new images as well

        await product.save();
        return res.status(200).json(product);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: updateProduct ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        // Cleanup locally uploaded files
        imageFiles.forEach((file) => {
            if (file.path) fs.unlinkSync(file.path);
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Field validation
        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid product ID" });

        // Find product
        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        // Authorization check
        if (product.seller.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this product" });
        }

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                if (image.public_id) {
                    if (image.public_id)
                        await deleteFromCloudinary(image.public_id);
                }
            }
        }

        // Remove product reference from seller's listings and all users' favorites
        await Promise.all([
            User.findByIdAndUpdate(product.seller, {
                $pull: { products: productId },
            }),
            User.updateMany(
                { favorites: productId },
                { $pull: { favorites: productId } },
            ),
        ]);

        // Delete the product from DB
        await product.deleteOne();

        return res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: deleteProduct ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Field validation
        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid product ID" });

        const product = await Product.findById(productId)
            .populate("seller", "name email avatar rating")
            .lean();

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        return res.status(200).json(product);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getProduct ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
