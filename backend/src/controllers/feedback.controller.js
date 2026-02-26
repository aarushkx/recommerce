import Feedback from "../models/feedback.model.js";
import { MIN_MESSAGE_LEN, MAX_MESSAGE_LEN } from "../lib/config.js";

export const postFeedback = async (req, res) => {
    try {
        const userId = req.user._id;
        const { message } = req.body;

        // Message validation
        if (!message?.trim())
            return res.status(400).json({ message: "Message is required" });

        if (
            message.trim().length < MIN_MESSAGE_LEN ||
            message.trim().length > MAX_MESSAGE_LEN
        )
            return res.status(400).json({
                message: `Feedback message must be between ${MIN_MESSAGE_LEN} and ${MAX_MESSAGE_LEN} characters`,
            });

        const feedback = await Feedback.create({
            user: userId,
            message,
        });
        return res.status(201).json({ feedback });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: postFeedback ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMyFeedback = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find feedback of user
        const feedback = await Feedback.find({ user: userId });
        if (feedback.length === 0)
            return res.status(200).json({ message: "No feedbacks yet" });

        return res.status(200).json({ feedback });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getMyFeedback ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 })
            .populate("user", "name email avatar")
            .lean();

        if (feedbacks.length === 0)
            return res.status(200).json({ message: "No feedbacks yet" });

        return res.status(200).json({ feedbacks });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: getAllFeedbacks ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
