import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}
