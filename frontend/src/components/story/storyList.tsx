import { useGetFollowingStories } from "@/services/storyServices";
import { IStory } from "@/types/story";
import { useState } from "react";
import Modal from "../_global/modal";
import StoryCarousel from "./storyCarrousel";
import Avatar from "../user/avatar";
import Spinner from "../_global/spinner";

const StoryList = () => {
  const { data: stories, isLoading, isError } = useGetFollowingStories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserStories, setSelectedUserStories] = useState<IStory[]>([]);
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleUserClick = (userId: string, userName: string) => {
    const userStories =
      stories?.filter((story) => story.user._id === userId) || [];
    setSelectedUserStories(userStories);
    setSelectedUserName(userName);
    handleModalToggle();
  };

  if (isLoading) return <Spinner />;

  const uniqueUsers = Array.from(
    new Set(stories?.map((story) => story.user._id))
  ).map((userId) => {
    return stories?.find((story) => story.user._id === userId);
  });

  return (
    <div>
      {stories?.length === 0 ? (
        <p className="text-center text-gray-500 py-5">
          Şu an için kimse bir şey paylaşmadı.
        </p>
      ) : (
        <div className="flex overflow-x-auto gap-4 p-2 justify-start items-center">
          {uniqueUsers?.map((story) => (
            <div
              key={story?.user._id}
              className="cursor-pointer flex flex-col items-center"
              onClick={() =>
                handleUserClick(story?.user._id!, story?.user.username!)
              }
            >
              <Avatar size={50} avatarUrl={story?.user.avatar} />
              <span className="text-xs">{story?.user.username}</span>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal
          title={selectedUserName}
          isOpen={isModalOpen}
          onClose={handleModalToggle}
        >
          <StoryCarousel stories={selectedUserStories} />
        </Modal>
      )}
    </div>
  );
};

export default StoryList;
