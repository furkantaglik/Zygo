import { IUser } from "@/types/user";
import Avatar from "./avatar";
import Link from "next/link";
import { Check } from "lucide-react";

const UserCard = ({ user }: { user: IUser }) => {
  return (
    <Link
      href={`/${user.username}`}
      className="flex gap-x-2 items-center font-semibold w-fit"
    >
      <Avatar size={40} avatarUrl={user.avatar} />
      <div className="flex items-center gap-x-1 ">
        <h1>{user.username}</h1>
        {user.verified && <Check className="text-primary" />}
      </div>
    </Link>
  );
};

export default UserCard;
