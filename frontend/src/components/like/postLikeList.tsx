import React from "react";
import Spinner from "../_global/spinner";
import Link from "next/link";
import { useGetPostLikes } from "@/services/likeServices";
import UserCard from "../user/userCard";

const PostLikeList = ({ postId }: { postId: string }) => {
  const { data: postLikes, isLoading } = useGetPostLikes(postId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Spinner />
      </div>
    );
  }

  if (!postLikes || postLikes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">Henüz Beğeni yok.</div>
    );
  }

  return (
    <section>
      <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
        {postLikes.map((like) => (
          <UserCard key={like._id} user={like.user} />
        ))}
      </div>
    </section>
  );
};

export default PostLikeList;
