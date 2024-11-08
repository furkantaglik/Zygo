import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import mongoose from "mongoose";
import { sendResponse } from "./sendResponse.js";

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    console.log("Sunucu hatası: ", err.message);
    return sendResponse(c, 500, "Sunucu hatası oluştu. Tekrar deneyin");
  }
  if (err instanceof mongoose.Error) {
    console.log("Veritabanı hatası: ", err.message);
    return sendResponse(c, 500, "Veritabanı hatası oluştu. Tekrar deneyin");
  }
  console.log("Beklenmedik hata: ", err.message);
  return sendResponse(c, 500, "Beklenmedik bir hata oluştu. Tekrar deneyin");
};
