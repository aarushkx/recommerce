import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const Feedback = mongoose.model("Feedbacks", feedbackSchema);
export default Feedback;
