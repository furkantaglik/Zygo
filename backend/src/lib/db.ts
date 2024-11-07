import mongoose, { type ConnectOptions } from "mongoose";
import { config } from "dotenv";

config();
const uri = process.env.MONGO_URL!;
const clientOptions: ConnectOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

export default async function runMongo() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
  }
}
