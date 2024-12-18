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
    <section className="">
      {savedPosts?.length === 0 ? (
        <p className="text-center text-gray-500">
          Kaydettikleriniz burada gösterilir
        </p>
      ) : (
        <div className="grid grid-cols-3 ">
          {savedPosts?.map((saved) => (
            <Link key={saved.post._id} href={`/post/${saved.post._id}`}>
              <PostImageCard post={saved.post} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Savedpage;
