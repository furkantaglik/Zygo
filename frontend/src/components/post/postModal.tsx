import { IPost } from "@/types/post";
import { IUser } from "@/types/user";
import React, { useEffect } from "react";
import { IComment } from "@/types/comment";
import { useGetComments } from "@/services/commentServices";
import UserCard from "../user/userCard";
import CommentCard from "../comment/commentCard";
import Spinner from "../spinner";
import PostBottom from "./postBottom";
import { useGetPostLikes } from "@/services/likeServices";
import { CircleX } from "lucide-react";

const PostModal = ({
  post,
  onClose,
  user,
}: {
  post: IPost;
  user: IUser;
  onClose: () => void;
}) => {
  const { data: comments, isLoading, error } = useGetComments(post._id);
  const { data: likes } = useGetPostLikes(post._id);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-60  mb-28 md:mb-0"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background max-w-screen-lg w-full h-screen md:h-[700px] relative shadow-lg grid md:grid-cols-2 overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-16 md:top-4 right-3 font-bold text-xl text-white px-2 py-1 rounded-full z-50"
        >
          <CircleX />
        </button>
        <div className="bg-transparent cursor-pointer flex items-center justify-center ">
          {post.mediaType === "video" ? (
            <video className=" w-full h-[700px]  " autoPlay controls loop>
              <source src={post.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              className=" object-cover"
              src={post.mediaUrl}
              alt={post.content}
            />
          )}
        </div>

        <div className="flex flex-col p-2 h-full ">
          {/* Kullanıcı Bilgileri */}
          <div className="flex justify-center border-b pb-2 border-primary">
            <UserCard user={user} />
          </div>

          {/* Yorumlar */}
          <div className="mt-4 flex-1 h-96">
            <h2 className="font-semibold mb-2 text-center">Yorumlar</h2>
            {isLoading ? (
              <Spinner />
            ) : comments?.length ? (
              <div className="flex flex-col gap-y-5 h-96 overflow-y-scroll no-scrollbar">
                {comments.map((comment: IComment) => (
                  <CommentCard
                    post={post}
                    key={comment._id}
                    user={user}
                    comment={comment}
                    currentUserId={user._id!}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center mt-10 font-semibold">
                İlk yorum yapan sen ol
              </p>
            )}
          </div>

          {/* PostBottom */}
          <div className="mt-auto">
            <PostBottom
              post={post}
              likes={likes!}
              userId={user._id}
              comments={comments!}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
