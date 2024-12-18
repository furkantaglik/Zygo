import { Server } from "socket.io";
import { Message } from "./models/message.js";
import type { ServerType } from "@hono/node-server";

const initializeSocket = (server: ServerType) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", async (userId, targetUserId) => {
      const roomName = [userId, targetUserId].sort().join("_");
      socket.join(roomName);

      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: targetUserId },
          { sender: targetUserId, receiver: userId },
        ],
      })
        .populate("sender", "username avatar")
        .populate("receiver", "username avatar");

      socket.emit("loadMessages", messages);
    });

    socket.on("typing", (userId, targetUserId) => {
      const roomName = [userId, targetUserId].sort().join("_");
      socket.to(roomName).emit("userTyping", socket.id);
    });

    socket.on("stopTyping", (userId, targetUserId) => {
      const roomName = [userId, targetUserId].sort().join("_");
      socket.to(roomName).emit("userStoppedTyping", socket.id);
    });

    socket.on("sendMessage", async ({ sender, receiver, content }) => {
      try {
        const newMessage = new Message({
          sender,
          receiver,
          content,
        });

        await newMessage.save();

        const populatedMessage = await Message.findById(newMessage._id)
          .populate("sender", "username avatar")
          .populate("receiver", "username avatar");

        const roomName = [sender, receiver].sort().join("_");
        io.to(roomName).emit("receiveMessage", populatedMessage);
      } catch (error) {
        console.error("Mesaj kaydedilirken hata oluştu:", error);
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

export default initializeSocket;
