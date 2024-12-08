"use client";

import { useGetFollowingPosts } from "@/services/postServices";
import Spinner from "@/components/_global/spinner";
import PostCard from "@/components/post/postCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Modal from "@/components/_global/modal";
import NewPost from "@/components/post/newPost";
import NewStory from "@/components/story/newStory";
import StoryList from "@/components/story/storyList";

const HomePage = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const {
    data: posts,
    isLoading: postsLoding,
    isError,
  } = useGetFollowingPosts();

  const searchParams = useSearchParams();
  const router = useRouter();

  if (postsLoding) {
    return <Spinner />;
  }

  return (
    <section>
      <div className="flex justify-between items-center gap-x-5">
        <Modal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          title="Yeni Gönderi"
        >
          <NewPost />
        </Modal>
        <Modal
          isOpen={isStoryModalOpen}
          onClose={() => setIsStoryModalOpen(false)}
          title="Yeni Hikaye"
        >
          <NewStory />
        </Modal>
      </div>
      <div className="border-b border-accent mb-10">
        <StoryList />
      </div>
      <div className="flex flex-col items-center gap-y-10 ">
        {posts!.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default HomePage;
