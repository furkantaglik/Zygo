"use client";
import Spinner from "@/components/_global/spinner";
import PostImageCard from "@/components/post/postImageCard";
import { useGetUserSaves } from "@/services/saveServices";
import Link from "next/link";
import React from "react";

const Savedpage = () => {
  const { data: savedPosts, isLoading } = useGetUserSaves();
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <section className="grid grid-cols-3 gap-2">
        {savedPosts?.map((saved, index) => (
          <Link key={saved.post._id} href={`/post/${saved.post._id}`}>
            <PostImageCard post={saved.post} />
          </Link>
        ))}
      </section>
    </>
  );
};

export default Savedpage;
