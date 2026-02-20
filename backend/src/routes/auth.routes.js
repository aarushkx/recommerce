import express from "express";
import {
    register,
    login,
    logout,
    currentUser,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// POST
router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.post("/logout", protect, logout);

// GET
router.get("/me", protect, currentUser);

export default router;
