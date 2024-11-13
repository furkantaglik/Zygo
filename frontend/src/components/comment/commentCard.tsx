import { IUser } from "@/types/user";
import UserCard from "../user/userCard";
import { IComment } from "@/types/comment";
import { useDeleteComment } from "@/services/commentServices"; // Yorum silme servisi
import { useState } from "react";
import { IPost } from "@/types/post";
import { Delete } from "lucide-react";

const CommentCard = ({
  post,
  user,
  comment,
  currentUserId,
}: {
  user: IUser;
  comment: IComment;
  currentUserId: string;
  post: IPost;
}) => {
  const { trigger: deleteCommentTrigger } = useDeleteComment(
    post._id,
    comment._id
  );

  const handleDeleteComment = async () => {
    await deleteCommentTrigger({ commentId: comment._id });
  };

  return (
    <div className="border-b border-accent relative">
      <UserCard user={user} />
      <p className="block text-sm bg-accent p-2 rounded-md">
        {comment.content}
      </p>
      {currentUserId === comment.user._id && (
        <button
          onClick={handleDeleteComment}
          className="text-xs text-primary absolute right-2 top-2"
        >
          <Delete />
        </button>
      )}
    </div>
  );
};

export default CommentCard;
