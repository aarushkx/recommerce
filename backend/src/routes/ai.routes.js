import express from "express";
import {
    enhanceProductDescription,
    enhanceReview,
} from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { limiter } from "../middlewares/rate-limit.middleware.js";

const router = express.Router();

// POST
router.post("/enhance-desc", protect, limiter, enhanceProductDescription);
router.post("/enhance-review", protect, limiter, enhanceReview);

export default router;
