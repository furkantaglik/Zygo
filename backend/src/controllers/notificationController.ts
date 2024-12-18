import type { Context } from "hono";
import { sendResponse } from "../lib/utils/sendResponse.js";
import { Notification } from "../models/notification.js";

export const getUserNotifications = async (c: Context) => {
  const userId = c.get("user").id;

  try {
    const notifications = await Notification.find({ user: userId })
      .populate("sender", "username avatar verified")
      .populate("post", "content mediaUrl")
      .sort({ createdAt: -1 });

    return sendResponse(
      c,
      200,
      "Bildirimler başarıyla getirildi.",
      notifications
    );
  } catch (error) {
    return sendResponse(c, 500, "Bildirimler alınırken bir hata oluştu.");
  }
};

export const markAllNotificationsAsRead = async (c: Context) => {
  const userId = c.get("user").id;

  try {
    const result = await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return sendResponse(c, 200, "Tüm bildirimler okundu olarak işaretlendi.");
  } catch (error) {
    return sendResponse(c, 500, "Bildirimler güncellenirken bir hata oluştu.");
  }
};
