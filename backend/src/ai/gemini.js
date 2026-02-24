import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL, MAX_OUTPUT_TOKENS, TEMPERATURE } from "../lib/config.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getAiResponse = async (prompt) => {
    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        generationConfig: {
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            temperature: TEMPERATURE,
        },
        contents: prompt,
    });
    return response.text;
};
