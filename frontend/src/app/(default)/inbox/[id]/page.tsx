"use client";
import Spinner from "@/components/_global/spinner";
import MessageBox from "@/components/message/messageBox";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useGetUserById } from "@/services/userServices";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const params = useParams<{ tag: string; id: string }>();
  const { user: currentUser, loading } = useAuthStore();
  const { data: targetUser, isLoading } = useGetUserById(params.id);

  if (loading || isLoading) {
    return <Spinner />;
  }

  return (
    <div className="relative min-h-screen">
      <MessageBox targetUser={targetUser!} currentUser={currentUser!} />
    </div>
  );
};

export default Page;
