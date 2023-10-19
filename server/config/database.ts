import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("Mongo URI not found in environment variables");
    }
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo Database! Success!");
  } catch (err) {
    console.error(err);
  }
};
