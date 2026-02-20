import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		buyer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "confirmed", "completed", "cancelled"],
			default: "pending",
		},
	},
	{ timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
