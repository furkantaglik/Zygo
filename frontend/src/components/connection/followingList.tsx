import { useGetFollowing, useUnfollow } from "@/services/connectionServices";
import React, { useState } from "react";
import Spinner from "../_global/spinner";
import Link from "next/link";
import { Delete } from "lucide-react";
import { useAuthStore } from "@/lib/zustand/authStore";
import UserCard from "../user/userCard";

const FollowingList = ({ userId }: { userId: string }) => {
  const { user: currentUser, loading } = useAuthStore();
  const { data: following, isLoading } = useGetFollowing(userId);
  const { mutate: unFollow } = useUnfollow();
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Spinner />
      </div>
    );
  }

  if (!following || following.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Henüz takip edilen yok.
      </div>
    );
  }

  const handleRemove = (unfollowUserId: string) => {
    unFollow({ userId: unfollowUserId });
  };

  return (
    <section>
      <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
        {following.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-4 hover:bg-accent rounded relative"
            onMouseEnter={() => setHoveredUser(user._id)}
            onMouseLeave={() => setHoveredUser(null)}
          >
            <UserCard user={user} />
            {currentUser?._id === userId && hoveredUser === user._id && (
              <button
                onClick={() => handleRemove(user._id)}
                className="absolute right-4 text-primary"
              >
                <Delete />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FollowingList;
