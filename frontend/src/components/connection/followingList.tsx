import { GetFollowing, Unfollow } from "@/services/connectionServices";
import React, { useState } from "react";
import Spinner from "../_global/spinner";
import Link from "next/link";

const FollowingList = ({ userId }: { userId: string }) => {
  const { data: following, isLoading } = GetFollowing(userId);
  const { mutate: unFollow } = Unfollow();
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  if (isLoading) {
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

  const handleRemove = (userId: string) => {
    unFollow({ userId });
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
            <Link
              href={`/${user.username}`}
              className="flex items-center gap-4"
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-500">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </Link>
            {hoveredUser === user._id && (
              <button
                onClick={() => handleRemove(user._id)}
                className="absolute right-4 px-2 py-1 bg-red-500 text-white rounded text-sm"
              >
                Kaldır
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FollowingList;
