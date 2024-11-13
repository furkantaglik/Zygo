import { IUser } from "@/types/user";
import Avatar from "./avatar";

const UserCard = ({ user }: { user: IUser }) => {
  return (
    <div className=" flex gap-x-2 items-center font-semibold ">
      <Avatar size={50} />
      <h1>{user.username}</h1>
    </div>
  );
};

export default UserCard;
