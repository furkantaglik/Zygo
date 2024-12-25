import { Comment } from "../models/comment.js";
import { sendResponse } from "../lib/utils/sendResponse.js";
import type { Context } from "hono";
import { Post } from "../models/post.js";
import { Notification } from "../models/notification.js";

export const createComment = async (c: Context) => {
  const { postId, content } = await c.req.json();
  const userId = c.get("user").id;

  try {
    const newComment = new Comment({ post: postId, user: userId, content });
    await newComment.save();

    const post = await Post.findById(postId).populate("user");
    if (post && post.user.id !== userId) {
      await Notification.create({
        user: post.user._id,
        sender: userId,
        type: "comment",
        post: postId,
        content,
      });
    }

    return sendResponse(c, 200, "Yorum başarıyla eklendi.", newComment);
  } catch (error) {
    console.log(error);

    return sendResponse(c, 500, "Yorum eklenirken bir hata oluştu.");
  }
};

export const deleteComment = async (c: Context) => {
  const { commentId } = c.req.param();
  const userId = c.get("user").id;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return sendResponse(c, 404, "Yorum bulunamadı.");
    }

    if (!comment.user || comment.user.toString() !== userId) {
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

  try {
    const comment = await Comment.findById(_id);
    if (!comment) {
      return sendResponse(c, 404, "Yorum bulunamadı.");
    }

    if (comment.user.toString() !== userId) {
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

  try {
    const comments = await Comment.find({ post: postId })

      .populate("user", "username avatar verified")
      .sort({ createdAt: -1 });

    return sendResponse(c, 200, "Yorumlar başarıyla getirildi.", comments);
  } catch (error) {
    return sendResponse(c, 500, "Yorumlar alınırken bir hata oluştu.");
  }
};
