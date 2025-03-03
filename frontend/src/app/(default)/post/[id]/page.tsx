"use client";
import React, { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Spinner from "@/components/_global/spinner";
import PostCard from "@/components/post/postCard";
import { useGetPostById, useGetUserPosts } from "@/services/postServices";

const PostDetailPage = () => {
  const params = useParams<{ id: string }>();
  const { data: post, isLoading: postLoading } = useGetPostById(params.id);
  const { data: userPosts, isLoading: userPostLoading } = useGetUserPosts(
    post && post.user._id
  );
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (params.id && userPosts && post) {
      const index = userPosts.findIndex((post) => post._id === params.id);
      if (index !== -1 && postRefs.current[index]) {
        postRefs.current[index]?.scrollIntoView({
          block: "center",
        });
      }
    }
  }, [params.id, userPosts]);

  useEffect(() => {});

  if (postLoading || userPostLoading) {
    return <Spinner />;
  }

  return (
    <section>
      <div className="flex flex-col items-center gap-y-10">
        {userPosts?.map((post, index) => (
          <div
            key={post._id}
            ref={(el) => {
              postRefs.current[index] = el;
            }}
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PostDetailPage;
