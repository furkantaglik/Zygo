"use client";
import { Heart, MessageCircle, Pin, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Modal from "../_global/modal";
import PostLikeList from "../like/postLikeList";
import { IPost } from "@/types/post";
import { IComment } from "@/types/comment";
import { ILike } from "@/types/like";
import { timeAgo } from "@/lib/utils/timeAgo";
import { useCreateComment } from "@/services/commentServices";
import {
  useCreateLike,
  useDeleteLike,
  useGetPostLikes,
} from "@/services/likeServices";
import {
  useGetUserSaves,
  useCreateSave,
  useDeleteSave,
} from "@/services/saveServices";

const PostBottom = ({
  post,
  userId,
  comments,
  handleShowComments,
  showComments,
}: {
  post: IPost;
  userId: string;
  comments: IComment[];
  handleShowComments: () => void;
  showComments: boolean;
}) => {
  const [newComment, setNewComment] = useState("");
  const [isShowLikeListModal, setShowLikeLİstModal] = useState(false);
  const { mutate: createLikeMutate } = useCreateLike();
  const { mutate: deleteLikeMutate } = useDeleteLike();
  const { mutate: createCommentMutate } = useCreateComment();
  const { data: likes } = useGetPostLikes(post._id);
  const { data: savedPosts } = useGetUserSaves();
  const { mutate: createSaveMutate } = useCreateSave();
  const { mutate: deleteSaveMutate } = useDeleteSave();

  const commentInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showComments && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [showComments]);

  const likedPost = likes?.find((like) => like.user._id === userId);
  const hasLiked = !!likedPost;
  const likeId = likedPost?._id;
  const hasSaved = savedPosts?.find((save) => save.post._id === post._id);

  const handleLikeToggle = () => {
    if (hasLiked && likeId) {
      deleteLikeMutate(likeId);
    } else {
      createLikeMutate({ postId: post._id });
    }
  };
  const handlePinClick = () => {
    if (hasSaved) {
      deleteSaveMutate(post._id);
    } else {
      createSaveMutate(post._id);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createCommentMutate({ content: newComment, postId: post._id });
    setNewComment("");
  };

  const handleShowLikeList = () => {
    setShowLikeLİstModal(true);
  };

  return (
    <div className="border-t border-accent flex flex-col py-3">
      <div className="flex justify-between gap-x-2 items-center">
        <div className="flex gap-x-4">
          <button onClick={handleLikeToggle}>
            <Heart
              className="hover:fill-red-600 hover:text-red-600"
              size={25}
              fill={hasLiked ? "red" : "none"}
              color={hasLiked ? "red" : "currentColor"}
            />
          </button>
          <button onClick={handleShowComments}>
            <MessageCircle
              size={25}
              fill={showComments ? "white" : "none"}
              color={showComments ? "white" : "currentColor"}
            />
          </button>
          <button>
            <Send size={25} />
          </button>
        </div>
        <div>
          <button onClick={handlePinClick}>
            <Pin
              size={25}
              fill={hasSaved ? "white" : "none"}
              color={hasSaved ? "white" : "currentColor"}
            />
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-x-1">
          <button
            onClick={handleShowLikeList}
            className="text-sm font-semibold"
          >
            {likes?.length || 0} Beğeni
          </button>
          <button
            onClick={handleShowComments}
            className="text-sm font-semibold"
          >
            {comments?.length || 0} Yorum
          </button>
        </div>
        <p className="text-xs text-gray-300">{timeAgo(post.createdAt)}</p>
      </div>

      {isShowLikeListModal && (
        <Modal
          title="Beğeni Listesi"
          isOpen={isShowLikeListModal}
          onClose={() => setShowLikeLİstModal(false)}
        >
          <PostLikeList postId={post._id} />
        </Modal>
      )}

      {showComments && (
        <form
          onSubmit={handleCommentSubmit}
          className="border-accent border-t relative pt-3"
        >
          <div className="flex items-center">
            <input
              ref={commentInputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Yorum ekle.."
              className="bg-transparent ring-0 border-0 outline-none w-full py-2 pr-14 border-b border-transparent focus:border-primary"
            />
            <button
              type="submit"
              className="text-xs text-primary absolute right-2 bottom-2"
            >
              Paylaş
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostBottom;
