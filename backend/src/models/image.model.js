import { Schema } from "mongoose";

const imageSchema = new Schema(
    {
        public_id: {
            type: String,
            default: null,
        },
        url: {
            type: String,
            default: null,
        },
    },
    { _id: false },
);

export default imageSchema;
