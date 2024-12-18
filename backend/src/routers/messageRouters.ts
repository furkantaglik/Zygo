import { Hono } from "hono";
import {
  deleteMessage,
  getInbox,
  getMessages,
  getUnreadMessages,
  markMessagesAsRead,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouters = new Hono();

messageRouters.post("/send-message", sendMessage);
messageRouters.get("/delete-message/:messageId", deleteMessage);
messageRouters.get("/get-messages/:userId", getMessages);
messageRouters.get("/get-inbox", getInbox);
messageRouters.get("/get-unread-messages", getUnreadMessages);
messageRouters.get("/mark-messages-as-read/:targetUserId", markMessagesAsRead);

export default messageRouters;
