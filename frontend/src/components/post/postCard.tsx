"use client";
import { useState } from "react";
import { IPost } from "@/types/post";
import { IComment } from "@/types/comment";
import { useGetCommentsByPostId } from "@/services/commentServices";
import UserCard from "../user/userCard";
import CommentCard from "../comment/commentCard";
import Spinner from "../_global/spinner";
import PostBottom from "./postBottom";
import { useGetPostLikes } from "@/services/likeServices";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useGetUserById } from "@/services/userServices";
import { MessageCircle } from "lucide-react";

const PostCard = ({ post }: { post: IPost }) => {
  const { user: currentUser, loading } = useAuthStore();
  const { data: user, isLoading: userLoading } = useGetUserById(post.user._id);
  const { data: comments, isLoading } = useGetCommentsByPostId(post._id);
  const { data: likes } = useGetPostLikes(post._id);

  const [showComments, setShowComments] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const handleShowComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleToggleContent = () => {
    setShowFullContent((prev) => !prev);
  };

  if (loading || !currentUser || userLoading) {
    return <Spinner />;
  }

  return (
    <section className="md:w-[700px] mx-auto relative">
      <div className="flex justify-start  border-accent border-b pb-2 mt-2 md:mt-0">
        <UserCard user={user!} />
      </div>

      {/* Yorumlar Bölümü */}
      {showComments && (
        <div className="absolute top-16 left-0 w-full h-[515px] bg-background z-10  border-b border-accent">
          <h2 className="font-semibold text-center border-b border-accent w-fit mx-auto">
            Yorumlar
          </h2>
          <div className="mt-5 max-h-[480px] overflow-y-auto no-scrollbar ">
            {isLoading ? (
              <Spinner />
            ) : comments?.length ? (
              <div className="flex flex-col gap-y-5 cursor-pointer">
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
              <p className="text-center font-semibold my-10 italic text-sm">
                İlk yorum yapan sen ol
              </p>
            )}
          </div>
        </div>
      )}

      <div className="relative mt-5">
        <div className="mx-auto flex justify-center items-center relative">
          {post.mediaType === "video" ? (
            <video autoPlay controls loop className="w-full h-[500px]">
              <source src={post.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={post.mediaUrl} alt={post.content} className="h-[500px]" />
          )}
        </div>
        <div>
          <PostBottom
            post={post}
            likes={likes!}
            userId={currentUser._id}
            comments={comments!}
            handleShowComments={handleShowComments}
            showComments={showComments}
          />
        </div>

        <div className="text-sm border-b-2 border-dashed border-accent">
          <p
            className={`italic ${!showFullContent ? "line-clamp-2" : ""}`}
            style={{
              WebkitLineClamp: !showFullContent ? 2 : "unset",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.content}
          </p>
          {post.content.length > 100 && (
            <button
              onClick={handleToggleContent}
              className="text-primary text-xs font-semibold  "
            >
              {showFullContent ? "Daha Az Göster" : "Devamını Göster"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostCard;
