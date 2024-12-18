import type { Context } from "hono";
import { sendResponse } from "../lib/utils/sendResponse.js";
import { Like } from "../models/like.js";
import { Post } from "../models/post.js";
import { Notification } from "../models/notification.js";

export const createLike = async (c: Context) => {
  const { postId } = await c.req.json();
  const userId = c.get("user").id;

  try {
    const existingLike = await Like.findOne({ post: postId, user: userId });
    if (existingLike) {
      return sendResponse(c, 400, "Bu gönderiyi zaten beğendiniz.");
    }

    const newLike = new Like({ post: postId, user: userId });
    await newLike.save();

    const post = await Post.findById(postId).populate("user");
    if (post && post.user.id !== userId) {
      await Notification.create({
        user: post.user._id,
        sender: userId,
        type: "like",
        post: postId,
      });
    }

    return sendResponse(c, 200, "Gönderi başarıyla beğenildi.", newLike);
  } catch (error) {
    return sendResponse(c, 500, "Beğeni eklenirken bir hata oluştu.");
  }
};

export const deleteLike = async (c: Context) => {
  const likeId = await c.req.param("postId");
  const userId = c.get("user").id;

  const existingLike = await Like.findOne({ _id: likeId, user: userId });
  if (!existingLike) {
    return sendResponse(c, 400, "Bu gönderiyi beğenmediniz.");
  }

  await existingLike.deleteOne();

  return sendResponse(c, 200, "Gönderi beğenisi başarıyla kaldırıldı.");
};

export const getPostLikes = async (c: Context) => {
  const { postId } = c.req.param();

  const likes = await Like.find({ post: postId })
    .populate("user", "username avatar")
    .sort({ createdAt: -1 });

  return sendResponse(c, 200, "Beğeniler başarıyla getirildi.", likes);
};
