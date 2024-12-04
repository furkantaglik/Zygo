"use client";
import Modal from "@/components/_global/modal";
import NewPost from "@/components/post/newPost";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <section>
      <div className="flex">
        <button
          onClick={handleOpen}
          className="bg-primary text-white font-semibold py-2 px-4 rounded"
        >
          Yeni Gönderi
        </button>
        <Modal isOpen={isModalOpen} onClose={handleClose} title="Yeni Gönderi">
          <NewPost />
        </Modal>
      </div>
    </section>
  );
};

export default HomePage;
