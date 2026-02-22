import express from "express";
import {
    createBooking,
    getMyBookings,
    getMySales,
    getSingleBooking,
    confirmBooking,
    cancelBooking,
    completeBooking,
} from "../controllers/booking.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST
router.post("/:productId", protect, createBooking);

// GET
router.get("/my-bookings", protect, getMyBookings);
router.get("/my-sales", protect, getMySales);
router.get("/:bookingId", protect, getSingleBooking);

// PATCH
router.patch("/:bookingId/confirm", protect, confirmBooking);
router.patch("/:bookingId/cancel", protect, cancelBooking);
router.patch("/:bookingId/complete", protect, completeBooking);

export default router;
