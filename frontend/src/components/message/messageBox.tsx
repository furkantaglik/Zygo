"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSendMessage, useGetMessages } from "@/services/messageServices";
import { Send, Undo2 } from "lucide-react";
import Spinner from "../_global/spinner";
import MessageCard from "./messageCard";
import UserCard from "../user/userCard";
import { IUser } from "@/types/user";
import Link from "next/link";

interface MessageBoxProps {
  targetUser: IUser;
  currentUser: IUser;
}

const MessageBox: React.FC<MessageBoxProps> = ({ targetUser, currentUser }) => {
  const { data: messages, isLoading } = useGetMessages(targetUser._id);
  const { mutate: sendMessage, isPending } = useSendMessage();
  const [content, setContent] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoading) return <Spinner />;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    sendMessage({ content, receiverId: targetUser._id });
    setContent("");
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="sticky top-0 bg-background z-10 border-b border-accent py-1">
        <div className="flex justify-between items-center w-full">
          <Link href="/inbox" className="flex-shrink-0">
            <Undo2 />
          </Link>
          <div className="flex justify-center items-center w-full">
            <UserCard user={targetUser} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar mb-8">
        <div className="flex flex-col gap-4 p-4">
          {messages?.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              isCurrentUser={message.sender._id === currentUser._id}
            />
          ))}
        </div>

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="sticky  bg-background z-10  py-4 w-full md:bottom-0 bottom-12  pt-2"
      >
        <div className="relative mx-auto">
          <input
            type="text"
            placeholder="Mesajınızı yazın..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full rounded-2xl p-3 bg-background outline-none border border-accent focus:border focus:border-primary"
          />
          <button
            type="submit"
            disabled={isPending}
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
