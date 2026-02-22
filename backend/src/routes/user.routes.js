import express from "express";
import {
	getUser,
	updateProfile,
	deleteAccount,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

//GET
router.get("/:id", protect, getUser);

//PUT
router.put("/update-profile", protect, upload.single("avatar"), updateProfile);

//DELETE
router.delete("/delete-account", protect, deleteAccount);

export default router;
