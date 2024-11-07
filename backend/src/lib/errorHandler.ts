import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import mongoose from "mongoose";
import { sendResponse } from "./sendResponse.js";

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    console.log("Sunucu hatası: ", err.message);
    return sendResponse(c, 500, "Sunucu hatası");
  }
  if (err instanceof mongoose.Error) {
    console.log("Veritabanı hatası: ", err.message);
    return sendResponse(c, 500, "Veritabanı hatası");
  }
  console.log("Beklenmedik hata: ", err.message);
  return sendResponse(c, 500, "Beklenmeyen bir hata");
};
