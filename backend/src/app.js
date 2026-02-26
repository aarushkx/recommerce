import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
    healthRoutes,
    authRoutes,
    userRoutes,
    productRoutes,
    bookingRoutes,
    aiRoutes,
    adminRoutes,
    reviewRoutes,
    feedbackRoutes,
} from "./routes/index.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/feedback", feedbackRoutes);

export default app;
