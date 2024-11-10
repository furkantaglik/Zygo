import { Comment } from "../models/comment.js";
import { sendResponse } from "../lib/utils/sendResponse.js";
import type { Context } from "hono";
import { validateObjectId } from "../lib/utils/valideObjectId.js";

const validateCommentAndPostIds = (commentId: string, postId: string) => {
  if (!validateObjectId(commentId) || !validateObjectId(postId)) {
    return { error: "Geçersiz yorum veya gönderi ID." };
  }
  return { valid: true };
};

export const createComment = async (c: Context) => {
  const { postId, content } = await c.req.json();
  const userId = c.get("user").id;

  const { error } = validateCommentAndPostIds("", postId);
  if (error) {
    return sendResponse(c, 400, error);
  }

  try {
    const newComment = new Comment({
      postId,
      userId,
      content,
    });

    await newComment.save();
    return sendResponse(c, 200, "Yorum başarıyla eklendi.", newComment);
  } catch (error) {
    return sendResponse(c, 500, "Yorum eklenirken bir hata oluştu.");
  }
};

export const deleteComment = async (c: Context) => {
  const { commentId } = c.req.param();
  const userId = c.get("user").id;

  const { error } = validateCommentAndPostIds(commentId, "");
  if (error) {
    return sendResponse(c, 400, error);
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return sendResponse(c, 404, "Yorum bulunamadı.");
    }

    if (!comment.userId || comment.userId.toString() !== userId) {
      return sendResponse(c, 403, "Bu yorumu silme yetkiniz yok.");
    }

    await comment.deleteOne();
    return sendResponse(c, 200, "Yorum başarıyla silindi.");
  } catch (error) {
    return sendResponse(c, 500, "Yorum silinirken bir hata oluştu.");
  }
};

export const updateComment = async (c: Context) => {
  const { content, _id } = await c.req.json();
  const userId = c.get("user").id;

  const { error } = validateCommentAndPostIds(_id, "");
  if (error) {
    return sendResponse(c, 400, error);
  }

  try {
    const comment = await Comment.findById(_id);
    if (!comment) {
      return sendResponse(c, 404, "Yorum bulunamadı.");
    }

    if (comment.userId.toString() !== userId) {
      return sendResponse(c, 403, "Bu yorumu güncelleme yetkiniz yok.");
    }

    comment.content = content;
    await comment.save();

    return sendResponse(c, 200, "Yorum başarıyla güncellendi.", comment);
  } catch (error) {
    return sendResponse(c, 500, "Yorum güncellenirken bir hata oluştu.");
  }
};

export const getCommentsByPostId = async (c: Context) => {
  const { postId } = c.req.param();

  const { error } = validateCommentAndPostIds("", postId);
  if (error) {
    return sendResponse(c, 400, error);
  }

  try {
    const comments = await Comment.find({ postId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    return sendResponse(c, 200, "Yorumlar başarıyla getirildi.", comments);
  } catch (error) {
    return sendResponse(c, 500, "Yorumlar alınırken bir hata oluştu.");
  }
};
