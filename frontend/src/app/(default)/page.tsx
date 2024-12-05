"use client";

import { useGetFollowingPosts } from "@/services/postServices";
import Spinner from "@/components/_global/spinner";
import PostCard from "@/components/post/postCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "@/components/_global/modal";
import NewPost from "@/components/post/newPost";
import { Image, Search } from "lucide-react";
import Logo from "@/components/_global/logo";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: posts, isLoading, isError } = useGetFollowingPosts();

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleOpen = () => {
    router.push("?tab=newPost");
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    setIsModalOpen(tab === "newPost");
  }, [searchParams]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !posts || posts.length === 0) {
    return (
      <p className="text-center font-semibold italic mt-10">
        Takip ettiğiniz kullanıcıların henüz bir gönderisi yok.
      </p>
    );
  }

  return (
    <section>
      <div className=" border-b border-accent pb-5 flex justify-between items-center gap-x-5">
        <button
          onClick={handleOpen}
          className="p-2  rounded-full border border-primary font-semibold text-sm  flex gap-x-2 items-center justify-center"
        >
          <Image />
        </button>
        <Modal isOpen={isModalOpen} onClose={handleClose} title="Yeni Gönderi">
          <NewPost />
        </Modal>
        <Logo />
        <button
          onClick={() => router.push("/search")}
          className="p-2  rounded-full border border-primary font-semibold text-sm  flex gap-x-2 items-center justify-center"
        >
          <Search />
        </button>
      </div>
      <div className="flex flex-col items-center gap-y-10">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default HomePage;
