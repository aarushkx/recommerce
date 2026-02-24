import { getAiResponse } from "../ai/gemini.js";
import {
    ENHANCE_PRODUCT_DESC_PROMPT,
    ENHANCE_REVIEW_PROMPT,
} from "../ai/prompts.js";

export const enhanceProductDescription = async (req, res) => {
    try {
        const { description } = req.body;
        if (!description)
            return res
                .status(400)
                .json({ message: "Product description is required" });

        const enhancedDescription = await getAiResponse(
            ENHANCE_PRODUCT_DESC_PROMPT(description),
        );
        return res.status(200).json(enhancedDescription);
    } catch (error) {
        console.log(
            "ERROR :: CONTROLLER :: enhanceProductDescription ::",
            error.message,
        );
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const enhanceReview = async (req, res) => {
    try {
        const { review } = req.body;
        if (!review)
            return res
                .status(400)
                .json({ message: "Review message is required" });

        const enhancedReview = await getAiResponse(
            ENHANCE_REVIEW_PROMPT(review),
        );
        return res.status(200).json(enhancedReview);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: enhanceReview ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
