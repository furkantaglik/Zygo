"use client";
import PostImageCard from "@/components/post/postImageCard";
import PostModal from "@/components/post/postModal";
import Spinner from "@/components/_global/spinner";
import { GetUserPosts } from "@/services/postServices";
import { IPost } from "@/types/post";
import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GetUserByUsername } from "@/services/userServices";
import { useAuthStore } from "@/lib/zustand/authStore";

export default function PostPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const postId = searchParams.get("p");
  const normalizedPathname = pathname.replace(/^\/+/, "");
  const { data: userData } = GetUserByUsername(normalizedPathname);
  const { user: currentUser } = useAuthStore();
  const { data, isLoading, error } = GetUserPosts(userData!._id);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (post: IPost) => {
    setSelectedPost(post);
    setIsOpen(true);
    router.push(`${pathname}?${createQueryString("p", post._id)}`);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsOpen(false);
    router.push(pathname);
  };
  useEffect(() => {
    closeModal();
  }, [normalizedPathname]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (postId && data) {
      const post = data.find((p) => p._id === postId);
      if (post) {
        setSelectedPost(post);
        setIsOpen(true);
      }
    }
  }, [postId, data]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="grid grid-cols-3 gap-2">
        {data?.map((post) => (
          <PostImageCard
            key={post._id}
            post={post}
            onClick={() => openModal(post)}
          />
        ))}
      </section>

      {isOpen && selectedPost && (
        <PostModal
          post={selectedPost}
          currentUser={currentUser!}
          user={userData!}
          onClose={closeModal}
        />
      )}
    </>
  );
}
