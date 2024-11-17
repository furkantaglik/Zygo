import { IPost } from "@/types/post";
import { Play, Image } from "lucide-react";
import React from "react";

const PostImageCard = ({
  post,
  onClick,
}: {
  post: IPost;
  onClick: () => void;
}) => {
  const mediaUrl =
    post.mediaType === "video"
      ? `${post.mediaUrl!.replace(/\.mp4$/, ".jpg")}`
      : post.mediaUrl;
  return (
    <div
      className="relative w-full md:h-[300px] h-[200px] bg-slate-100 cursor-pointer"
      onClick={onClick}
    >
      <img
        className="w-full h-full object-cover"
        src={mediaUrl}
        alt={post.content}
      />
      {post.mediaType === "video" ? (
        <span className="absolute top-2 right-2  ">
          <Play />
        </span>
      ) : (
        <span className="absolute top-2 right-2 ">
          <Image />
        </span>
      )}
    </div>
  );
};

export default PostImageCard;
