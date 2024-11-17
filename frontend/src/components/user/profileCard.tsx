"use client";
import { useAuthStore } from "@/lib/zustand/authStore";
import { GetUserPosts } from "@/services/postServices";
import {
  GetFollowers,
  GetFollowing,
  SendRequest,
  Unfollow,
} from "@/services/connectionServices";
import Avatar from "./avatar";
import {
  LayoutPanelTop,
  Pin,
  GalleryHorizontalEnd,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IUser } from "@/types/user";

const ProfileCard = ({ userData }: { userData: IUser }) => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { mutate: sendFollowRequest } = SendRequest();
  const { mutate: unfollowUser } = Unfollow();

  return (
    <>
      <section className="grid md:grid-cols-12 grid-cols-1 gap-y-3 border-b border-accent pb-5 max-w-screen-lg mx-auto">
        <div className="md:col-span-3 mx-auto">
          <Avatar size={150} avatarUrl={userData.avatar} />
        </div>
        <div className="md:col-span-9 flex flex-col gap-y-5 w-full items-center md:items-start">
          <h1 className="text-xl font-semibold flex items-center gap-x-4">
            {userData.username}
            {user && user._id === userData._id && (
              <Link
                href="/account"
                className="flex items-center p-1 bg-primary rounded font-bold text-sm gap-x-1"
              >
                <Settings size={20} />
              </Link>
            )}
          </h1>

          <div>
            <h3 className="text-center md:text-start">
              {userData.firstName} {userData.lastName}
            </h3>
            <small className="italic">{userData.bio}</small>
          </div>
        </div>
      </section>
      <div className="flex mx-auto justify-between md:mx-80">
        <Link
          className={`flex items-center gap-x-1 uppercase text-sm font-semibold border-t pt-2 ${
            pathname === `/${userData.username}`
              ? "text-primary border-primary"
              : "text-gray-500 border-accent"
          }`}
          href={`/${userData.username}`}
        >
          <LayoutPanelTop size={15} /> Gönderiler
        </Link>
        <Link
          className={`flex items-center gap-x-1 uppercase text-sm font-semibold border-t pt-2 ${
            pathname === `/${userData.username}/saved`
              ? "text-primary border-primary"
              : "text-gray-500 border-accent"
          }`}
          href={`/${userData.username}/saved`}
        >
          <Pin size={15} /> Kaydedilenler
        </Link>
        <Link
          className={`flex items-center gap-x-1 uppercase text-sm font-semibold border-t pt-2 ${
            pathname === `/${userData.username}/stories`
              ? "text-primary border-primary"
              : "text-gray-500 border-accent"
          }`}
          href={`/${userData.username}/stories`}
        >
          <GalleryHorizontalEnd size={15} /> Hikayeler
        </Link>
      </div>
    </>
  );
};
export default ProfileCard;
