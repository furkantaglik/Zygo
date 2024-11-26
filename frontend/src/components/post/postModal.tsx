"use client";
import { IPost } from "@/types/post";
import { IUser } from "@/types/user";
import { IComment } from "@/types/comment";
import { GetCommentsByPostId } from "@/services/commentServices";
import UserCard from "../user/userCard";
import CommentCard from "../comment/commentCard";
import Spinner from "../_global/spinner";
import PostBottom from "./postBottom";
import { GetPostLikes } from "@/services/likeServices";
import { CircleX } from "lucide-react";

const PostModal = ({
  post,
  onClose,
  user,
  currentUser,
}: {
  post: IPost;
  user: IUser;
  currentUser: any;
  onClose: () => void;
}) => {
  const { data: comments, isLoading, error } = GetCommentsByPostId(post._id);
  const { data: likes } = GetPostLikes(post._id);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 overflow-y-auto no-scrollbar"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background w-full max-w-screen-lg  h-full relative shadow-lg grid sm:grid-cols-2 "
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-bold text-xl text-white px-2 py-1 rounded-full z-50 hover:text-primary"
        >
          <CircleX />
        </button>
        <div className="bg-transparent flex items-center justify-center">
          {post.mediaType === "video" ? (
            <video className="  w-full sm:h-[700px]" autoPlay controls loop>
              <source src={post.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              className="w-full object-cover"
              src={post.mediaUrl}
              alt={post.content}
            />
          )}
        </div>

        <div className="flex flex-col p-4 bg-background">
          <div className="flex justify-center border-b pb-2 border-primary">
            <UserCard user={user} />
          </div>

          <div className="mt-4 flex-1">
            <h2 className="font-semibold mb-2 text-center">Yorumlar</h2>
            {isLoading ? (
              <Spinner />
            ) : comments?.length ? (
              <div className="flex flex-col gap-y-5 max-h-[500px] overflow-y-auto no-scrollbar">
                {comments.map((comment: IComment) => (
                  <CommentCard
                    post={post}
                    key={comment._id}
                    user={comment.user}
                    comment={comment}
                    currentUserId={currentUser._id!}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center mt-10 font-semibold">
                İlk yorum yapan sen ol
              </p>
            )}
          </div>

          <div className="mt-auto">
            <PostBottom
              post={post}
              likes={likes!}
              userId={currentUser._id}
              comments={comments!}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
