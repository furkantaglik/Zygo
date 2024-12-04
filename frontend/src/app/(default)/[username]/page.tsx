"use client";
import PostImageCard from "@/components/post/postImageCard";
import Spinner from "@/components/_global/spinner";
import { useGetUserPosts } from "@/services/postServices";
import { IPost } from "@/types/post";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetUserByUsername } from "@/services/userServices";
import { useAuthStore } from "@/lib/zustand/authStore";
import Link from "next/link";

export default function PostPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const postId = searchParams.get("p");
  const normalizedPathname = pathname.replace(/^\/+/, "");
  const { data: userData } = useGetUserByUsername(normalizedPathname);
  const { user: currentUser } = useAuthStore();
  const { data, isLoading } = useGetUserPosts(userData!._id);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (post: IPost) => {
    setSelectedPost(post);
    setIsOpen(true);
    router.push(`${pathname}?p=${post._id}`);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsOpen(false);
    router.push(pathname);
  };

  useEffect(() => {
    closeModal();
  }, [normalizedPathname]);

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
          <Link key={post._id} href={`/post/${post._id}`}>
            <PostImageCard post={post} />
          </Link>
        ))}
      </section>

      {/* Modal için */}

      {/* {isOpen && selectedPost && (
        <PostModal
          post={selectedPost}
          currentUser={currentUser!}
          user={userData!}
          onClose={closeModal}
        />
      )} */}
    </>
  );
}
