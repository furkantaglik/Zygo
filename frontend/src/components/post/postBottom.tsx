import { timeAgo } from "@/lib/utils/timeAgo";
import { CreateComment } from "@/services/commentServices";
import { CreateLike, DeleteLike } from "@/services/likeServices";
import { IComment } from "@/types/comment";
import { ILike } from "@/types/like";
import { IPost } from "@/types/post";
import { Heart, MessageCircle, Pin, Send } from "lucide-react";
import { useState } from "react";

const PostBottom = ({
  post,
  likes,
  userId,
  comments,
}: {
  post: IPost;
  likes: ILike[];
  userId: string;
  comments: IComment[];
}) => {
  const [newComment, setNewComment] = useState("");
  const { mutate: createLikeMutate } = CreateLike();
  const { mutate: deleteLikeMutate } = DeleteLike();
  const { mutate: CreateCommentMutate } = CreateComment();

  const likedPost = likes?.find((like) => like.user._id === userId);
  const hasLiked = !!likedPost;
  const likeId = likedPost?._id;

  const handleLikeToggle = async () => {
    if (hasLiked && likeId) {
      deleteLikeMutate(likeId);
    } else {
      createLikeMutate({ postId: post._id });
    }
  };
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    CreateCommentMutate({ content: newComment, postId: post._id });
    setNewComment("");
  };

  return (
    <div className="border-t border-accent mt-2 flex flex-col">
      <div className="flex justify-between gap-x-2 items-center">
        <div className="flex gap-x-4">
          <button onClick={handleLikeToggle}>
            <Heart
              size={25}
              fill={hasLiked ? "red" : "none"}
              color={hasLiked ? "red" : "currentColor"}
            />
          </button>
          <button>
            <MessageCircle size={25} />
          </button>
          <button>
            <Send size={25} />
          </button>
        </div>
        <div>
          <button>
            <Pin size={25} />
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-sm font-semibold">
          {likes?.length || 0} Beğeni {comments?.length || 0} Yorum
        </p>
        <p className="text-sm text-gray-300">{timeAgo(post.createdAt)}</p>
      </div>
      <form
        onSubmit={handleCommentSubmit}
        className="mt-2 border-t border-accent relative"
      >
        <div className="flex items-center">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorum ekle.."
            className="bg-transparent ring-0 border-0 outline-none w-full p-2 pr-14 border-b border-transparent focus:border-primary"
          />
          <button
            type="submit"
            className="text-xs text-primary absolute right-2 bottom-2"
          >
            Paylaş
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostBottom;
