"use client";
import Spinner from "@/components/_global/spinner";
import Avatar from "@/components/user/avatar";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useGetInbox } from "@/services/messageServices";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useGetFollowing } from "@/services/connectionServices";

const InboxPage = () => {
  const { data: inbox, isLoading } = useGetInbox();
  const { user: currentUser, loading } = useAuthStore();

  const { data: followingUsers, isLoading: followingLoading } = useGetFollowing(
    currentUser!._id
  );

  if (isLoading || loading || followingLoading) {
    return <Spinner />;
  }

  return (
    <section>
      <h1 className="text-center font-semibold text-lg border-b border-accent mb-5">
        Mesajlar
      </h1>

      {inbox && inbox.length > 0 && (
        <div>
          <div className="flex flex-col gap-5 max-w-[600px] mx-auto">
            {inbox.map((user) => (
              <Link
                href={`/inbox/${user._id}`}
                key={user._id}
                className="border border-accent p-2 rounded-full flex justify-between items-center hover:bg-accent"
              >
                <div className="flex gap-x-1 items-center font-semibold">
                  <Avatar size={50} avatarUrl={user.avatar} />
                  <h1>{user.username}</h1>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="text-xs  text-gray-500">
                    Sohbete devam et
                  </span>
                  <MessageCircle />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Takip Edilen Kullanıcılardan Sohbet Başlatma */}
      {followingUsers && followingUsers.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold  mb-3 text-center">
            Yeni Sohbet Önerileri
          </h2>
          <div className="flex flex-col gap-5 max-w-[600px] mx-auto">
            {followingUsers.map((user) => (
              <Link
                href={`/inbox/${user._id}`}
                key={user._id}
                className="border border-accent p-2 rounded-full flex justify-between items-center hover:bg-accent"
              >
                <div className="flex gap-x-1 items-center font-semibold">
                  <Avatar size={50} avatarUrl={user.avatar} />
                  <h1>{user.username}</h1>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="text-xs  text-gray-500">Yeni sohbet</span>
                  <MessageCircle />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {(!inbox || inbox.length === 0) &&
        (!followingUsers || followingUsers.length === 0) && (
          <p className="text-center mt-5">
            Henüz kimseyle mesajlaşmadınız veya takip ettiğiniz kimse yok.
          </p>
        )}
    </section>
  );
};

export default InboxPage;
