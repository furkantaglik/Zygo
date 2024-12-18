import type { Context } from "hono";
import { Story } from "../models/story.js";
import { sendResponse } from "../lib/utils/sendResponse.js";
import { validateObjectId } from "../lib/utils/valideObjectId.js";
import { User, type IUser } from "../models/user.js";

export const createStory = async (c: Context) => {
  const file = await c.get("file");
  const { content } = await c.req.parseBody();
  const user = c.get("user") as IUser;

  if (!file || !file.path) {
    return sendResponse(c, 400, "Dosya yüklenmedi.");
  }

  if (!content) {
    return sendResponse(c, 400, "İçerik alanı zorunludur.");
  }

  const newStory = new Story({
    user: user.id,
    content,
    mediaUrl: file?.path,
    mediaType: file?.mediaType,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  await newStory.save();
  return sendResponse(c, 200, "Hikaye başarıyla oluşturuldu.", newStory);
};

export const deleteStory = async (c: Context) => {
  const { storyId } = c.req.param();
  const userId = c.get("user").id;

  if (!validateObjectId(storyId) || !validateObjectId(userId)) {
    return sendResponse(c, 400, "Geçersiz kullanıcı veya hikaye ID.");
  }

  const story = await Story.findById(storyId);

  if (!story) {
    return sendResponse(c, 404, "Hikaye bulunamadı.");
  }

  if (story.user.toString() !== userId) {
    return sendResponse(c, 403, "Bu hikayeyi silme yetkiniz yok.");
  }

  await Story.deleteOne({ _id: storyId });

  return sendResponse(c, 200, "Hikaye başarıyla silindi.");
};

export const getAllStories = async (c: Context) => {
  const stories = await Story.find({
    expiresAt: { $gte: new Date() },
  })
    .populate("user", "username")
    .sort({ createdAt: -1 });

  return sendResponse(
    c,
    200,
    "Geçerli hikayeler başarıyla listelendi.",
    stories
  );
};

export const getUserStories = async (c: Context) => {
  const { userId } = c.req.param();

  if (!validateObjectId(userId)) {
    return sendResponse(c, 400, "Geçersiz kullanıcı ID.");
  }

  const stories = await Story.find({
    user: userId,
    expiresAt: { $gte: new Date() },
  })
    .populate("user", "username")
    .sort({ createdAt: -1 });

  return sendResponse(
    c,
    200,
    "Kullanıcıya ait geçerli hikayeler başarıyla listelendi.",
    stories
  );
};

export const getFollowingStories = async (c: Context) => {
  const userId = c.get("user").id;
  try {
    const user = await User.findById(userId).populate("following", "_id");
    if (!user) {
      return sendResponse(c, 404, "KUllanıcı bulunamadı");
    }
    const followingIds = user.following.map((f: any) => f._id);
    const stories = await Story.find({ user: { $in: followingIds } })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    return sendResponse(
      c,
      200,
      "Takip edilen kullanıcıların hikayeleri başarıyla listelendi.",
      stories
    );
  } catch (error) {
    return sendResponse(
      c,
      500,
      "Takip edilen hikayeler listelenirken bir hata oluştu."
    );
  }
};
