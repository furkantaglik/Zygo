import type { Context } from "hono";
import { sendResponse } from "../lib/utils/sendResponse.js";
import { Save } from "../models/save.js";
import type { IUser } from "../models/user.js";

export const createSave = async (c: Context) => {
  const user = c.get("user") as IUser;
  const postId = c.req.param("postId");

  if (!postId) {
    return sendResponse(c, 404, "Gönderi Bulunamadı");
  }

  try {
    const existingSave = await Save.findOne({ user: user.id, post: postId });

    if (existingSave) {
      return sendResponse(c, 400, "Bu gönderi zaten kaydedilmiş.");
    }

    const savedPost = await Save.create({
      user: user.id,
      post: postId,
    });

    return sendResponse(c, 200, "Gönderi başarıyla kaydedildi.", savedPost);
  } catch (error) {
    console.log(error);
    return sendResponse(c, 500, "Gönderi kaydedilirken bir hata oluştu.");
  }
};

export const deleteSave = async (c: Context) => {
  const user = c.get("user");
  const postId = c.req.param("postId");

  try {
    const deletedSave = await Save.findOneAndDelete({
      user: user.id,
      post: postId,
    });

    if (!deletedSave) {
      return sendResponse(c, 404, "Kaydedilen gönderi bulunamadı.");
    }

    return sendResponse(c, 200, "Gönderi kaydedilenlerden kaldırıldı.");
  } catch (error) {
    return sendResponse(
      c,
      500,
      "Gönderi kaydedilenlerden kaldırılırken bir hata oluştu."
    );
  }
};

export const getUserSaves = async (c: Context) => {
  const user = c.get("user");

  try {
    const savedPosts = await Save.find({ user: user.id })
      .sort({ createdAt: -1 })
      .populate("post");

    return sendResponse(c, 200, "Kaydedilen gönderiler getirildi.", savedPosts);
  } catch (error) {
    return sendResponse(
      c,
      500,
      "Kaydedilen gönderiler getirilirken bir hata oluştu."
    );
  }
};
