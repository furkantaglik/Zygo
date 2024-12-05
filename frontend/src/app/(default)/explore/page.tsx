"use client";
import PostCard from "@/components/post/postCard";
import { useGetAllPosts } from "@/services/postServices";
import React from "react";

const ExplorePage = () => {
  const { data: posts, isLoading, isError } = useGetAllPosts();

  if (isError || !posts || posts.length === 0) {
    return (
      <p className="text-center font-semibold italic mt-10">
        kullanıcıların henüz bir gönderisi yok.
      </p>
    );
  }
  return (
    <section>
      <div className="flex flex-col items-center gap-y-10">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default ExplorePage;
