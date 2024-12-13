"use client";
import Spinner from "@/components/_global/spinner";
import PostImageCard from "@/components/post/postImageCard";
import SearchUser from "@/components/user/searchUser";
import { useGetAllPosts } from "@/services/postServices";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const ExplorePage = () => {
  const { data: posts, isLoading } = useGetAllPosts();
  const [showSearchModal, setShowSearchModal] = useState(false);

  if (isLoading) {
    return <Spinner />;
  }

  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-gray-500">Henüz kimse Birşey paylaşmadı</p>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center mb-5">
        <button
          onClick={() => setShowSearchModal(true)}
          className="border border-accent py-2 px-10 rounded-2xl bg-accent flex gap-x-2 text-sm items-center font-semibold"
        >
          <Search /> Kullanıcı Ara
        </button>
        {showSearchModal && (
          <SearchUser onClose={() => setShowSearchModal(false)} />
        )}
      </div>
      <section className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post._id}`}>
            <PostImageCard post={post} />
          </Link>
        ))}
      </section>
    </>
  );
};

export default ExplorePage;
