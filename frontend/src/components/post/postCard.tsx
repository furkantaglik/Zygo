"use client";
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

const PostCard = ({ post }: { post: IPost }) => {
  const { user: currentUser, loading } = useAuthStore();
  const { data: user, isLoading: userLoading } = useGetUserById(post.user._id);
  const { data: comments, isLoading } = useGetCommentsByPostId(post._id);
  const { data: likes } = useGetPostLikes(post._id);

  if (loading || !currentUser || userLoading) {
    return <Spinner />;
  }

  return (
    <section>
      <div className="flex justify-center mx-auto border-accent border-b pb-2 mt-2 md:mt-0">
        <UserCard user={user!} />
      </div>
      <div>
        <div className="mx-auto flex justify-center ite">
          {post.mediaType === "video" ? (
            <video autoPlay controls loop>
              <source src={post.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={post.mediaUrl} alt={post.content} />
          )}
        </div>

        <div>
          <PostBottom
            post={post}
            likes={likes!}
            userId={currentUser._id}
            comments={comments!}
          />
        </div>

        <div className="my-5 flex-1 ">
          <h2 className="font-semibold  text-center  border-b border-accent w-fit mx-auto">
            Yorumlar
          </h2>
          {isLoading ? (
            <Spinner />
          ) : comments?.length ? (
            <div className="flex flex-col gap-y-5 max-h-[500px] overflow-y-auto no-scrollbar mt-5">
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
    </section>
  );
};

export default PostCard;
