import { IUser } from "@/types/user";
import React from "react";

const Avatar = ({
  size,
  avatarUrl,
}: {
  size: number;
  avatarUrl: string | undefined | null;
}) => {
  return (
    <img
      className="rounded-full border-primary border-2"
      src={
        avatarUrl
          ? avatarUrl
          : "https://cdn-icons-png.flaticon.com/512/266/266033.png"
      }
      style={{ width: size, height: size }}
      alt="Avatar"
    />
  );
};

export default Avatar;
