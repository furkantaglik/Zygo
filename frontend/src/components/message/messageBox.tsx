import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Send, Undo2 } from "lucide-react";
import UserCard from "../user/userCard";
import Link from "next/link";
import { IUser } from "@/types/user";
import MessageCard from "./messageCard";
import { useMarkMessagesAsRead } from "@/services/messageServices";

interface MessageBoxProps {
  targetUser: IUser;
  currentUser: IUser;
}

const socket = io("https://zygobackend.vercel.app");

const MessageBox: React.FC<MessageBoxProps> = ({ targetUser, currentUser }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTypingTimeout, setIsTypingTimeout] = useState<any>(null);
  const { mutate } = useMarkMessagesAsRead();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages?.length) {
      mutate(targetUser._id);
    }
  }, [messages, mutate]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  socket.connect();

  useEffect(() => {
    socket.emit("joinRoom", currentUser._id, targetUser._id);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("loadMessages", (messages) => {
      setMessages(messages);
    });

    socket.on("userTyping", () => {
      setTyping(true);
    });

    socket.on("userStoppedTyping", () => {
      setTyping(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser, targetUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);

    if (isTypingTimeout) clearTimeout(isTypingTimeout);

    socket.emit("typing", currentUser._id, targetUser._id);

    setIsTypingTimeout(
      setTimeout(() => {
        socket.emit("stopTyping", currentUser._id, targetUser._id);
        setTyping(false);
      }, 1000)
    );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    const newMessage = {
      sender: currentUser._id,
      receiver: targetUser._id,
      content,
    };

    socket.emit("sendMessage", newMessage);
    setContent("");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  console.log(messages);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="sticky top-0 bg-background z-10 border-b border-accent py-1">
        <div className="flex justify-between items-center w-full">
          <Link href="/inbox">
            <Undo2 />
          </Link>
          <div className="flex flex-col items-center w-full h-[60px]">
            <UserCard user={targetUser} />
            {typing && (
              <div className="flex items-center justify-center animate-pulse ms-10">
                <div className="text-gray-500 text-sm italic">Yazıyor...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative md:bottom-0 bottom-10">
        <div className="flex flex-col gap-4 p-4">
          {messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              isCurrentUser={message.sender._id === currentUser._id}
            />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="sticky bg-background z-10 py-4 w-full md:bottom-0 bottom-12 pt-2"
      >
        <div className="relative mx-auto">
          <input
            ref={inputRef}
            type="text"
            placeholder="Mesajınızı yazın..."
            value={content}
            onChange={handleInputChange}
            className="flex-1 w-full rounded-2xl p-3 bg-background outline-none border border-accent focus:border-primary"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <Send />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageBox;
