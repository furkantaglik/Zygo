import { IUser } from "@/types/user";
import UserCard from "../user/userCard";
import { IComment } from "@/types/comment";
import { useDeleteComment } from "@/services/commentServices";
import { IPost } from "@/types/post";
import { Delete } from "lucide-react";
import Link from "next/link";

const CommentCard = ({
  user,
  comment,
  currentUserId,
}: {
  user: IUser;
  comment: IComment;
  currentUserId: string;
  post: IPost;
}) => {
  const { mutate: deleteComment } = useDeleteComment();

  const handleDeleteComment = async () => {
    deleteComment(comment._id);
  };

  return (
    <div className="border-b border-accent relative">
      <div className="">
        <div className=" col-span-2">
          <UserCard user={comment.user} />
        </div>
        <p className="block text-sm bg-accent p-2 rounded-md w-full break-words col-span-9">
          {comment.content}
        </p>
      </div>
      {currentUserId === comment.user._id && (
        <button
          type="button"
          onClick={handleDeleteComment}
          className="text-xs text-primary absolute right-2 top-0"
        >
          <Delete />
        </button>
      )}
    </div>
  );
};

export default CommentCard;
