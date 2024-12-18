import { useState } from "react";
import { IPost } from "@/types/post";
import { IComment } from "@/types/comment";
import { useGetCommentsByPostId } from "@/services/commentServices";
import UserCard from "../user/userCard";
import CommentCard from "../comment/commentCard";
import Spinner from "../_global/spinner";
import PostBottom from "./postBottom";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useGetUserById } from "@/services/userServices";
import { useDeletePost } from "@/services/postServices";
import { Delete } from "lucide-react";
import Modal from "../_global/modal";

const PostCard = ({ post }: { post: IPost }) => {
  const [showComments, setShowComments] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user: currentUser, loading } = useAuthStore();
  const { data: user, isLoading: userLoading } = useGetUserById(post.user._id);
  const { data: comments, isLoading } = useGetCommentsByPostId(post._id);
  const { mutate } = useDeletePost();

  const handleShowComments = () => setShowComments((prev) => !prev);
  const handleToggleContent = () => setShowFullContent((prev) => !prev);

  if (loading || !currentUser || userLoading) {
    return <Spinner />;
  }

  const handleDeletePost = () => {
    mutate(post._id);
  };

  return (
    <section className="md:w-[700px] mx-auto relative mb-5 ">
      <div className="flex justify-between items-center border-accent border-b">
        <UserCard user={user!} />
        {/* Gönderi sahibiyse silme butonu */}
        {currentUser._id === post.user._id && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 font-semibold text-sm"
          >
            <Delete />
          </button>
        )}
      </div>

      {/* delete modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Gönderiyi Sil"
          footer={
            <>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-accent rounded"
              >
                Hayır
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-primary rounded"
              >
                Evet
              </button>
            </>
          }
        >
          <p>Gönderiyi silmek istediğinize Emin misiniz?</p>
        </Modal>
      )}

      {/* Yorumlar Bölümü */}
      {showComments && (
        <div className="absolute top-10 left-0 w-full h-[522px] bg-background z-10  border-b border-accent">
          <h2 className="font-semibold text-center border-b border-accent w-fit mx-auto">
            Yorumlar
          </h2>
          <div className="mt-5 max-h-[480px] overflow-y-auto no-scrollbar">
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

      {/* Gönderi İçeriği */}
      <div className="relative mt-5">
        <div className="mx-auto flex justify-center items-center relative">
          {post.mediaType === "video" ? (
            <video autoPlay controls loop className="object-fill h-[500px]">
              <source src={post.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={post.mediaUrl}
              alt={post.content}
              className="h-[500px] object-fill"
            />
          )}
        </div>
        <div>
          <PostBottom
            post={post}
            userId={currentUser._id}
            comments={comments!}
            handleShowComments={handleShowComments}
            showComments={showComments}
          />
        </div>

        <div className="text-sm border-b-2 border-dashed border-accent pb-2">
          <p
            className={`italic ${!showFullContent ? "line-clamp-2" : ""}`}
            style={{
              WebkitLineClamp: !showFullContent ? 2 : "unset",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
            }}
          >
            <strong> {post.user.username}</strong> {post.content}
          </p>
          {post.content.length > 100 && (
            <button
              onClick={handleToggleContent}
              className="text-primary text-xs font-semibold"
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
