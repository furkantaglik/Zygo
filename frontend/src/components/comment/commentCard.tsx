import { IUser } from "@/types/user";
import UserCard from "../user/userCard";
import { IComment } from "@/types/comment";
import { DeleteComment } from "@/services/commentServices"; // Yorum silme servisi
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
  const { mutate: deleteCommentTrigger } = DeleteComment();

  const handleDeleteComment = async () => {
    deleteCommentTrigger(comment._id);
  };

  return (
    <Link href={user.username} className="border-b border-accent relative">
      <UserCard user={comment.user} />
      <p className="block text-sm bg-accent p-2 rounded-md">
        {comment.content}
      </p>
      {currentUserId === comment.user._id && (
        <button
          type="button"
          onClick={handleDeleteComment}
          className="text-xs text-primary absolute right-2 top-2"
        >
          <Delete />
        </button>
      )}
    </Link>
  );
};

export default CommentCard;