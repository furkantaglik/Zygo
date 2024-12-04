"use client";

//  Kullanım Dışı ----------------------------------------
import { IPost } from "@/types/post";
import { IUser } from "@/types/user";
import { IComment } from "@/types/comment";
import { useGetCommentsByPostId } from "@/services/commentServices";
import UserCard from "../user/userCard";
import CommentCard from "../comment/commentCard";
import Spinner from "../_global/spinner";
import PostBottom from "./postBottom";
import { useGetPostLikes } from "@/services/likeServices";
import { Delete } from "lucide-react";
import { useDeletePost } from "@/services/postServices";
import { useState } from "react";
import Modal from "../_global/modal";
import { useRouter } from "next/navigation";

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
  const { data: comments, isLoading } = useGetCommentsByPostId(post._id);
  const { data: likes } = useGetPostLikes(post._id);
  const { mutate: removePostMutate } = useDeletePost();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleRemovePost = () => {
    removePostMutate(post._id);
    setIsDeleteModalOpen(false);
    onClose();
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 overflow-y-auto no-scrollbar"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background w-full max-w-screen-lg h-full relative shadow-lg grid sm:grid-cols-2 border border-accent"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-4 font-bold text-xl text-white px-2 py-1 rounded-full z-50 hover:text-primary"
        >
          ✕
        </button>
        <div className="bg-transparent flex items-center justify-center">
          {post.mediaType === "video" ? (
            <video className="w-full sm:h-[700px]" autoPlay controls loop>
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
          <div className="flex justify-between border-b border-accent pb-2  items-center">
            {currentUser._id === user._id && (
              <button
                onClick={handleDeleteClick}
                className="ml-0 hover:text-primary"
              >
                <Delete />
              </button>
            )}
            <div className="mx-auto">
              <UserCard user={user} />
            </div>
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

      {/* Silme onay modalı */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Silme Onayı"
          footer={
            <div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-accent px-4 py-2 rounded  mr-2"
              >
                İptal
              </button>
              <button
                onClick={handleRemovePost}
                className="bg-primary text-white px-4 py-2 rounded "
              >
                Evet, Sil
              </button>
            </div>
          }
        >
          <p>Bu gönderiyi silmek istediğinizden emin misiniz?</p>
        </Modal>
      )}
    </div>
  );
};

export default PostModal;
