import { IUser } from "@/types/user";
import Avatar from "./avatar";
import Link from "next/link";
const UserCard = ({ user }: { user: IUser }) => {
  return (
    <Link
      href={`/${user.username}`}
      className=" flex gap-x-2 items-center font-semibold  w-fit"
    >
      <Avatar size={50} avatarUrl={user.avatar} />
      <h1>{user.username}</h1>
    </Link>
  );
};

export default UserCard;
