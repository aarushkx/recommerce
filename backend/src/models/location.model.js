import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
	{
		area: {
			type: String,
			required: true,
		},
		pincode: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
	},
	{ _id: false },
);


export default locationSchema;
