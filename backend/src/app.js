import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes import
import healthRoutes from "./routes/health.routes.js";

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

export default app;
