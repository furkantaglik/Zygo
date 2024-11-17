import type { Context, Next } from "hono";
import { sendResponse } from "../lib/utils/sendResponse.js";
import { config } from "dotenv";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";
import type { CloudinaryResponse } from "../lib/cloudinary.js";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const uploadFile = async (c: Context, next: Next) => {
  const formData = await c.req.parseBody();
  const file = formData.image as File;

  if (!file) {
    return next();
  }

  try {
    const mimeType = file.type;
    const supportedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/jpg",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/avi",
      "video/mov",
    ];

    if (!supportedTypes.includes(mimeType)) {
      return sendResponse(c, 403, "Desteklenmeyen medya biçimi");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    const cloudinaryResponse = await new Promise<CloudinaryResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: mimeType.startsWith("video/") ? "video" : "image" },
          (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result as CloudinaryResponse);
          }
        );
        bufferStream.pipe(uploadStream);
      }
    );

    c.set("file", {
      path: cloudinaryResponse.secure_url,
      mediaType: cloudinaryResponse.resource_type,
    });
  } catch (err) {
    console.error("Dosya yüklenirken bir hata oluştu:", err);
    return sendResponse(c, 500, "Dosya yüklenirken bir hata oluştu.");
  } finally {
    await next();
  }
};
