import mongoose, { Schema } from "mongoose";
import imageSchema from "./image.model.js";
import locationSchema from "./location.model.js";

const productSchema = new Schema(
	{
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			index: true,
		},
		category: {
			type: String,
			required: true,
			index: true,
		},
		tags: [
			{
				type: String,
			},
		],
		condition: {
			type: String,
			enum: ["new", "used", "refurbished"],
			required: true,
		},
		location: locationSchema,
		images: [imageSchema],
		status: {
			type: String,
			enum: ["available", "booked", "sold"],
			default: "available",
			index: true,
		},
	},
	{ timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
