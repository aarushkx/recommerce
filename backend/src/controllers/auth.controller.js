import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/token.js";
import { uploadOnCloudinary } from "../lib/cloudinary.js";
import {
    APP_NAME,
    MIN_NAME_LEN,
    MAX_NAME_LEN,
    MAX_EMAIL_LEN,
    PHONE_NUMBER_LEN,
    MIN_PASSWORD_LEN,
} from "../lib/config.js";
import fs from "fs";

export const register = async (req, res) => {
    const avatarLocalPath = req.file?.path;
    try {
        let { name, email, phoneNumber, password, location } = req.body;

        // Sanitization
        name = name?.trim();
        email = email?.trim().toLowerCase();
        phoneNumber = phoneNumber?.trim();

        // Field validation
        if (!name) return res.status(400).json({ message: "Name is required" });

        if (name.length < MIN_NAME_LEN || name.length > MAX_NAME_LEN)
            return res.status(400).json({
                message: `Name must be between ${MIN_NAME_LEN} and ${MAX_NAME_LEN} characters`,
            });

        if (!email)
            return res.status(400).json({ message: "Email is required" });

        if (email.length > MAX_EMAIL_LEN)
            return res.status(400).json({
                message: `Email cannot exceed ${MAX_EMAIL_LEN} characters`,
            });

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email))
            return res.status(400).json({ message: "Invalid email" });

        if (!phoneNumber)
            return res
                .status(400)
                .json({ message: "Phone number is required" });

        const phoneRegex = new RegExp(`^[0-9]{${PHONE_NUMBER_LEN}}$`);
        if (!phoneRegex.test(phoneNumber))
            return res.status(400).json({
                message: `Invalid phone number. Should be ${PHONE_NUMBER_LEN} digits`,
            });

        if (!password)
            return res.status(400).json({ message: "Password is required" });

        if (password.length < MIN_PASSWORD_LEN)
            return res.status(400).json({
                message: `Password must be at least ${MIN_PASSWORD_LEN} characters`,
            });

        if (!location)
            return res.status(400).json({ message: "Location is required" });

        let parsedLocation;
        try {
            parsedLocation = JSON.parse(location);
        } catch {
            return res.status(400).json({ message: "Invalid location format" });
        }

        const { area, pincode, city, state, country } = parsedLocation;
        if (!area || !pincode || !city || !state || !country)
            return res
                .status(400)
                .json({ message: "All location fields are required" });

        // Check existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { phoneNumber }],
        });

        if (existingUser)
            return res.status(400).json({
                message: "User with this email or phone number already exists",
            });

        // Upload avatar
        let avatar;
        if (avatarLocalPath) {
            const uploadedAvatar = await uploadOnCloudinary(
                avatarLocalPath,
                `${APP_NAME.toLowerCase()}/avatars`,
            );

            if (!uploadedAvatar?.secure_url)
                return res
                    .status(500)
                    .json({ message: "Avatar upload failed" });

            avatar = {
                public_id: uploadedAvatar.public_id,
                url: uploadedAvatar.secure_url,
            };
        } else {
            avatar = {
                public_id: null,
                url: `${process.env.BASE_URL}/default-avatar.png`,
            };
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            avatar,
            location: parsedLocation,
        });

        // Generate JWT token and set cookie
        generateTokenAndSetCookie(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            avatar: newUser.avatar,
            location: newUser.location,
            isSeller: newUser.isSeller,
            rating: newUser.rating,
        });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: register ::", error);
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        // Cleanup locally uploaded avatar file
        if (avatarLocalPath && fs.existsSync(avatarLocalPath))
            fs.unlinkSync(avatarLocalPath);
    }
};

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email?.trim().toLowerCase();

        // Field validation
        if (!email)
            return res.status(400).json({ message: "Email is required" });

        if (email.length > MAX_EMAIL_LEN)
            return res.status(400).json({
                message: `Email cannot exceed ${MAX_EMAIL_LEN} characters`,
            });

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email))
            return res.status(400).json({ message: "Invalid email format" });

        if (!password)
            return res.status(400).json({ message: "Password is required" });

        // Find user
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        // Check password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token and set cookie
        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            location: user.location,
            isSeller: user.isSeller,
            rating: user.rating,
        });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: login ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            // TODO: May need to update the following fields for deployment
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        return res.status(200).json({
            message: "Logged out successfully",
        });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: logout ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: currentUser ::", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
