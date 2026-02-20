import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            `${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
        );
        console.log("Connected to MongoDB!");
        console.log("Connection Host:", conn.connection.host);
    } catch (error) {
        console.log("Failed to connect to database", error);
        process.exit(1);
    }
};

export default connectDB;
