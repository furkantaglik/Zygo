"use client";
import { useAuthStore } from "@/lib/zustand/authStore";
import Avatar from "./avatar";
import {
  LayoutPanelTop,
  Pin,
  GalleryHorizontalEnd,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IUser } from "@/types/user";
import ProfileConnectionCard from "../connection/profileConnectionCard";

const ProfileCard = ({ userData }: { userData: IUser }) => {
  const pathname = usePathname();
  const { user: currentUser } = useAuthStore();
  return (
    <>
      <section className="grid lg:grid-cols-12 grid-cols-1 gap-y-3 border-b border-accent pb-5 max-w-screen-lg mx-auto">
        <div className="lg:col-span-3 mx-auto">
          <Avatar size={150} avatarUrl={userData.avatar} />
        </div>
        <div className="lg:col-span-9 flex flex-col gap-y-5 w-full items-center lg:items-start">
          <h1 className="text-xl font-semibold flex items-center gap-x-4">
            {userData.username}
            {currentUser && currentUser._id === userData._id && (
              <Link
                href="/account"
                className="flex items-center p-1 bg-primary rounded font-bold text-sm gap-x-1"
              >
                <Settings size={20} />
              </Link>
            )}
          </h1>
          <ProfileConnectionCard userData={userData} />
          <div>
            <h3 className="text-center lg:text-start">
              {userData.firstName} {userData.lastName}
            </h3>
            <small className="italic">{userData.bio}</small>
          </div>
        </div>
      </section>
      <div className="flex mx-auto justify-between  max-w-lg">
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
