"use client";
import PostImageCard from "@/components/post/postImageCard";
import Spinner from "@/components/_global/spinner";
import { useGetUserPosts } from "@/services/postServices";
import { usePathname } from "next/navigation";
import { useGetUserByUsername } from "@/services/userServices";
import Link from "next/link";
import { useState } from "react";
import Modal from "@/components/_global/modal";
import NewPost from "@/components/post/newPost"; // NewPost bileşenini içeri aktaralım

export default function PostPage() {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/+/, "");
  const { data: userData } = useGetUserByUsername(normalizedPathname);
  const { data: userPosts, isLoading } = useGetUserPosts(userData!._id);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section>
      {userPosts?.length === 0 ? (
        <div className="flex flex-col  w-fit justify-center items-center  mx-auto p-10 rounded-full mt-10 border border-accent">
          <p className="text-md font-semibold">İlk Gönderini Paylaş</p>
          <button
            onClick={handleModalToggle}
            className="border border-primary   font-semibold  py-2 px-4 rounded-full mt-5 hover:bg-primary"
          >
            Yeni Gönderi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 mt-4">
          {userPosts?.map((post) => (
            <Link key={post._id} href={`/post/${post._id}`}>
              <PostImageCard post={post} />
            </Link>
          ))}
        </div>
      )}

      <Modal
        title="Yeni Gönderi"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <NewPost />
      </Modal>
    </section>
  );
}
