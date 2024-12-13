import React from "react";
import { IMessage } from "@/types/message";

interface MessageCardProps {
  message: IMessage;
  isCurrentUser: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  isCurrentUser,
}) => {
  return (
    <div
      className={`p-2 rounded-2xl max-w-[70%] ${
        isCurrentUser
          ? "bg-background border border-accent self-end"
          : "bg-accent self-start"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-x-2 items-center">
          <img
            src={message.sender.avatar}
            alt={message.sender.username}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-semibold">
            {message.sender.username}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(message.createdAt || "").toLocaleTimeString()}
        </span>
      </div>

      <div className="flex justify-between items-center gap-x-2">
        <p className="break-words">{message.content}</p> {/* Mesaj içeriği */}
      </div>
    </div>
  );
};

export default MessageCard;
