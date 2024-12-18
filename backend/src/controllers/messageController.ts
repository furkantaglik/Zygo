import type { Context } from "hono";
import { sendResponse } from "../lib/utils/sendResponse.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";

export const sendMessage = async (c: Context) => {
  const { content, receiver } = await c.req.json();
  const sender = c.get("user").id;

  if (!content || !receiver) {
    return sendResponse(c, 400, "İçerik ve alıcı ID'si zorunludur.");
  }

  const newMessage = new Message({
    content,
    sender,
    receiver,
  });

  await newMessage.save();

  return sendResponse(c, 200, "Mesaj başarıyla gönderildi.", newMessage);
};

export const deleteMessage = async (c: Context) => {
  const { messageId } = c.req.param();
  const userId = c.get("user").id;

  const message = await Message.findById(messageId);

  if (!message) {
    return sendResponse(c, 404, "Mesaj bulunamadı.");
  }

  if (
    message.sender.toString() !== userId &&
    message.receiver.toString() !== userId
  ) {
    return sendResponse(c, 403, "Bu mesajı silme yetkiniz yok.");
  }

  await Message.deleteOne({ _id: messageId });

  return sendResponse(c, 200, "Mesaj başarıyla silindi.");
};

export const getMessages = async (c: Context) => {
  const { userId: otherUserId } = c.req.param();
  const currentUserId = c.get("user").id;

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: currentUserId },
    ],
  })
    .sort({ createdAt: +1 })
    .populate("sender", "username avatar")
    .populate("receiver", "username avatar");

  return sendResponse(c, 200, "Mesajlar başarıyla listelendi.", messages);
};

export const getInbox = async (c: Context) => {
  const currentUserId = c.get("user").id;

  const messages = await Message.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }],
  })
    .select("sender receiver")
    .lean();

  const userIds = new Set<string>();
  messages.forEach((message) => {
    if (message.sender.toString() !== currentUserId) {
      userIds.add(message.sender.toString());
    }
    if (message.receiver.toString() !== currentUserId) {
      userIds.add(message.receiver.toString());
    }
  });

  const chatUsers = await User.find({
    _id: { $in: Array.from(userIds) },
  }).select("username avatar verified");

  return sendResponse(
    c,
    200,
    "Mesajlaşılmış kullanıcılar başarıyla listelendi.",
    chatUsers
  );
};

export const markMessagesAsRead = async (c: Context) => {
  const { targetUserId } = c.req.param();
  const currentUserId = c.get("user").id;

  try {
    const result = await Message.updateMany(
      {
        receiver: currentUserId,
        sender: targetUserId,
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    return sendResponse(c, 200, "Mesaj başarıyla okundu olarak işaretlendi.");
  } catch (error) {
    return sendResponse(c, 500, "Mesaj güncellenirken bir hata oluştu.");
  }
};

export const getUnreadMessages = async (c: Context) => {
  const currentUserId = c.get("user").id;

  const unreadMessages = await Message.find({
    receiver: currentUserId,
    isRead: false,
  })
    .populate("sender", "username avatar")
    .populate("receiver", "username avatar")
    .sort({ createdAt: +1 });

  return sendResponse(
    c,
    200,
    "Okunmamış mesajlar başarıyla listelendi.",
    unreadMessages
  );
};
