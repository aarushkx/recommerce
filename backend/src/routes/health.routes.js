import express from "express";
import { health } from "../controllers/health.controller.js";

const router = express.Router();

// GET
router.get("/", health);

export default router;
