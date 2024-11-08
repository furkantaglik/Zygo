import type { Context } from "hono";
import { sendResponse } from "../lib/utils/sendResponse.js";
import { Like } from "../models/like.js";

export const createLike = async (c: Context) => {
  const { postId } = await c.req.json();
  const userId = c.get("user").id;

  const existingLike = await Like.findOne({ postId, userId });
  if (existingLike) {
    return sendResponse(c, 400, "Bu gönderiyi zaten beğendiniz.");
  }

  const newLike = new Like({
    postId,
    userId,
  });

  await newLike.save();

  return sendResponse(c, 200, "Gönderi başarıyla beğenildi.", newLike);
};

export const deleteLike = async (c: Context) => {
  const { postId } = await c.req.json();
  const userId = c.get("user").id;

  const existingLike = await Like.findOne({ postId, userId });
  if (!existingLike) {
    return sendResponse(c, 400, "Bu gönderiyi beğenmediniz.");
  }

  await existingLike.deleteOne();

  return sendResponse(c, 200, "Gönderi beğenisi başarıyla kaldırıldı.");
};

export const getPostLikes = async (c: Context) => {
  const { postId } = c.req.param();

  const likes = await Like.find({ postId })
    .populate("userId", "username")
    .sort({ createdAt: -1 });

  return sendResponse(c, 200, "Beğeniler başarıyla getirildi.", likes);
};
