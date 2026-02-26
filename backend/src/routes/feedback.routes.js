import express from "express";
import {
    postFeedback,
    getMyFeedback,
    getAllFeedbacks,
} from "../controllers/feedback.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

//POST
router.post("/", protect, postFeedback);

//GET
router.get("/get-feedbacks", protect, adminOnly, getAllFeedbacks);
router.get("/:userId", protect, getMyFeedback);

export default router;
