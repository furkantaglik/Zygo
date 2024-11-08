import type { Context } from "hono";
import { Post } from "../models/post.js";
import { sendResponse } from "../lib/utils/sendResponse.js";

const checkUserPermission = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);
  if (!post) return { error: "Gönderi bulunamadı." };
  if (post.user.toString() !== userId)
    return { error: "Bu gönderiye erişim yetkiniz yok." };
  return { post };
};

export const createPost = async (c: Context) => {
  const { content, mediaUrl, mediaType } = await c.req.json();
  const userId = c.get("user").id;

  if (!content) {
    return sendResponse(c, 400, "İçerik alanı zorunludur.");
  }

  const newPost = new Post({
    user: userId,
    content,
    mediaUrl,
    mediaType,
  });

  try {
    await newPost.save();
    return sendResponse(c, 200, "Gönderi başarıyla oluşturuldu.", newPost);
  } catch (err) {
    return sendResponse(c, 500, "Gönderi oluşturulurken bir hata oluştu.");
  }
};

export const updatePost = async (c: Context) => {
  const { postId } = c.req.param();
  const { content, mediaUrl, mediaType } = await c.req.json();
  const userId = c.get("user").id;

  const { post, error } = await checkUserPermission(postId, userId);
  if (error || !post)
    return sendResponse(c, 404, error || "Gönderi bulunamadı.");

  post.content = content || post.content;
  post.mediaUrl = mediaUrl || post.mediaUrl;
  post.mediaType = mediaType || post.mediaType;

  try {
    await post.save();
    return sendResponse(c, 200, "Gönderi başarıyla güncellendi.", post);
  } catch (err) {
    return sendResponse(c, 500, "Gönderi güncellenirken bir hata oluştu.");
  }
};

export const deletePost = async (c: Context) => {
  const { postId } = c.req.param();
  const userId = c.get("user").id;

  const { post, error } = await checkUserPermission(postId, userId);
  if (error || !post)
    return sendResponse(c, 404, error || "Gönderi bulunamadı.");

  try {
    await post.deleteOne();
    return sendResponse(c, 200, "Gönderi başarıyla silindi.");
  } catch (err) {
    return sendResponse(c, 500, "Gönderi silinirken bir hata oluştu.");
  }
};

export const getUserPosts = async (c: Context) => {
  const { userId } = c.req.param();
  if (!userId) {
    return sendResponse(c, 400, "Kullanıcı ID'si eksik.");
  }

  try {
    const posts = await Post.find({ user: userId }).populate(
      "user",
      "username"
    );
    return sendResponse(
      c,
      200,
      "Kullanıcıya ait gönderiler başarıyla listelendi.",
      posts
    );
  } catch (err) {
    return sendResponse(c, 500, "Gönderiler listelenirken bir hata oluştu.");
  }
};

export const getAllPosts = async (c: Context) => {
  try {
    const posts = await Post.find()
      .populate("user", "firstName lastName username")
      .sort({ createdAt: -1 });
    return sendResponse(c, 200, "Tüm gönderiler başarıyla listelendi.", posts);
  } catch (err) {
    return sendResponse(c, 500, "Gönderiler listelenirken bir hata oluştu.");
  }
};

export const getByPostId = async (c: Context) => {
  const { postId } = c.req.param();

  try {
    const post = await Post.findById(postId).populate(
      "user",
      "firstName lastName username"
    );

    if (!post) {
      return sendResponse(c, 404, "Gönderi bulunamadı.");
    }

    return sendResponse(c, 200, "Gönderi başarıyla bulundu.", post);
  } catch (err) {
    return sendResponse(c, 500, "Gönderi getirilirken bir hata oluştu.");
  }
};
