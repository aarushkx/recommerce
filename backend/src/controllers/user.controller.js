import User from "../models/user.model.js";
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

		if (name) {
			if (name.length < MIN_NAME_LEN || name.length > MAX_NAME_LEN)
				return res.status(400).json({
					message: `Name must be between ${MIN_NAME_LEN} and ${MAX_NAME_LEN} characters`,
				});

			user.name = name;
		}

		if (email) {
			if (email.length > MAX_EMAIL_LEN)
				return res.status(400).json({
					message: `Email cannot exceed ${MAX_EMAIL_LEN} characters`,
				});

			const emailRegex =
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			if (!emailRegex.test(email))
				return res.status(400).json({ message: "Invalid email" });

			user.email = email;
		}

		if (phoneNumber) {
			const phoneRegex = new RegExp(`^[0-9]{${PHONE_NUMBER_LEN}}$`);
			if (!phoneRegex.test(phoneNumber))
				return res.status(400).json({
					message: `Invalid phone number. Should be ${PHONE_NUMBER_LEN} digits`,
				});

			user.phoneNumber = phoneNumber;
		}

		if (newPassword) {
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
			user.password = await bcrypt.hash(password, salt);
		}

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
		if (avatarLocalPath) fs.unlinkSync(avatarLocalPath);
	}
};

export const deleteAccount = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);

		if (!user) return res.status(404).json({ message: "User not found" });

	    // Delete avatar from cloudinary if exists
		if (user.avatar.public_id) await deleteFromCloudinary(user.avatar);
		await user.deleteOne();

		res.clearCookie("jwt", {
			httpOnly: true, // TODO: May need to update the following fields for deployment
			sameSite: "strict",
		});

		return res.status(200).json({ message: "Account Deleted Succesfully" });
	} catch (error) {
		console.log("ERROR :: CONTROLLER :: deleteAccount :: ", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
