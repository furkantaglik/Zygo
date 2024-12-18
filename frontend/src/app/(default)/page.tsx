"use client";

import { useGetFollowingPosts } from "@/services/postServices";
import Spinner from "@/components/_global/spinner";
import PostCard from "@/components/post/postCard";
import { useState } from "react";
import Modal from "@/components/_global/modal";
import NewPost from "@/components/post/newPost";
import NewStory from "@/components/story/newStory";
import StoryList from "@/components/story/storyList";
import { useGetAllUsers } from "@/services/userServices";
import UserCard from "@/components/user/userCard";

const HomePage = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const { data: posts, isLoading: postsLoading } = useGetFollowingPosts();
  const { data: allUsers, isLoading: usersLoading } = useGetAllUsers();
  const hasFollowing = posts && posts.length > 0;

  if (postsLoading || usersLoading) {
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
        <h2 className=" font-semibold text-md">Hikayeler</h2>
        <StoryList />
      </div>

      {!hasFollowing && allUsers && (
        <div className="mb-10">
          <h2 className="text-md font-semibold mb-4">Önerilen Kullanıcılar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allUsers.map((user) => (
              <div
                key={user._id}
                className="border border-accent p-4 rounded-lg shadow-md"
              >
                <UserCard user={user} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-y-10 ">
        {hasFollowing ? (
          posts!.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-center text-gray-500">
            Takip ettiğiniz kimse yok. Önerilen kullanıcıları takip
            edebilirsiniz.
          </p>
        )}
      </div>
    </section>
  );
};

export default HomePage;
