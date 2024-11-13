"use client";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useGetUserByUsername } from "@/services/userServices";
import React, { useEffect } from "react";
import Spinner from "../spinner";
import Avatar from "./avatar";
import {
  GalleryHorizontalEnd,
  LayoutPanelTop,
  Pin,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetUserPosts } from "@/services/postServices";
import { useGetFollowers } from "@/services/connectionServices";

const ProfileCard = ({ username }: { username: string }) => {
  const { user } = useAuthStore();
  const { data: userData, isLoading } = useGetUserByUsername(username);
  const { data: postData } = useGetUserPosts(userData?._id);
  const { data: followingData } = useGetFollowers(userData?._id);
  const { data: followersData } = useGetFollowers(userData?._id);
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading) {
    return <Spinner />;
  }
  if (!userData) {
    router.push("/");
  }

  if (user && user.username === userData?.username) {
    return (
      <>
        <section className="grid md:grid-cols-12 grid-cols-1 gap-y-3  border-b border-accent pb-5 max-w-screen-lg mx-auto">
          <div className="md:col-span-3 mx-auto">
            <Avatar size={150} />
          </div>
          <div className="md:col-span-9 flex flex-col gap-y-5 w-full items-center md:items-start">
            <h1 className="text-xl font-semibold flex items-center gap-x-4">
              {userData.username}
              <Link
                href="/account"
                className="flex items-center p-1 bg-primary rounded font-bold text-sm gap-x-1"
              >
                <Settings size={20} />
              </Link>
            </h1>
            <div className="gap-x-5 flex">
              <button>
                <b>{postData?.length || 0}</b> Gönderi
              </button>
              <button>
                <b>{followersData?.length || 0}</b> Takipçi
              </button>
              <button>
                <b>{followingData?.length || 0}</b> Takip
              </button>
            </div>
            <div>
              <h3 className="text-center md:text-start ">
                {userData.firstName} {userData.lastName}
              </h3>

              <small className="italic">{userData.bio}</small>
            </div>
          </div>
        </section>
        <div className="flex  mx-auto justify-between md:mx-80 ">
          <Link
            className={`flex items-center gap-x-1 uppercase text-sm font-semibold border-t pt-2 ${
              pathname === "/" + userData.username
                ? " text-primary border-primary"
                : " text-gray-500 border-accent"
            }`}
            href={"/" + userData.username}
          >
            <LayoutPanelTop size={15} /> Gönderiler
          </Link>
          <Link
            className={`flex items-center gap-x-1 uppercase text-sm font-semibold border-t pt-2 ${
              pathname === "/" + userData.username + "/saved"
                ? " text-primary border-primary"
                : " text-gray-500 border-accent"
            }`}
            href={"/" + userData.username + "/saved"}
          >
            <Pin size={15} /> Kaydedilenler
          </Link>
          <Link
            className={`flex items-center gap-x-1 uppercase text-sm font-semibold border-t pt-2 ${
              pathname === "/" + userData.username + "/stories"
                ? " text-primary border-primary"
                : " text-gray-500 border-accent"
            }`}
            href={"/" + userData.username + "/stories"}
          >
            <GalleryHorizontalEnd size={15} /> Hikayeler
          </Link>
        </div>
      </>
    );
  }

  if (userData) {
    return (
      <>
        <section className="grid md:grid-cols-12 grid-cols-1 gap-y-3  border-b border-secondary pb-5 max-w-screen-lg mx-auto">
          <div className="md:col-span-3 mx-auto">
            <Avatar size={150} />
          </div>
          <div className="md:col-span-9 flex flex-col gap-y-5 w-full items-center md:items-start">
            <h1 className="text-xl font-semibold flex items-center gap-x-4">
              {userData.username}
            </h1>
            <div className="gap-x-5 flex">
              <button>
                <b>{postData?.length || 0}</b> Gönderi
              </button>
              <button>
                <b>{followersData?.length || 0}</b> Takipçi
              </button>
              <button>
                <b>{followingData?.length || 0}</b> Takip
              </button>
            </div>
            <div>
              <h3 className="text-center md:text-start ">
                {userData.firstName} {userData.lastName}
              </h3>

              <small className="italic">{userData.bio}</small>
            </div>
          </div>
        </section>
        <div className="flex  mx-auto justify-between md:mx-80 ">
          <Link
            className={`flex items-center gap-x-1 uppercase text-sm font-semibold border-t pt-2 ${
              pathname === "/" + userData.username
                ? " text-primary border-primary"
                : " text-gray-500 border-accent"
            }`}
            href={"/" + userData.username}
          >
            <LayoutPanelTop size={15} /> Gönderiler
          </Link>
          <Link
            className={`flex items-center gap-x-1 uppercase text-sm font-semibold border-t pt-2 ${
              pathname === "/" + userData.username + "/saved"
                ? " text-primary border-primary"
                : " text-gray-500 border-accent"
            }`}
            href={"/" + userData.username + "/saved"}
          >
            <Pin size={15} /> Kaydedilenler
          </Link>
          <Link
            className={`flex items-center gap-x-1 uppercase text-sm font-semibold border-t pt-2 ${
              pathname === "/" + userData.username + "/stories"
                ? " text-primary border-primary"
                : " text-gray-500 border-accent"
            }`}
            href={"/" + userData.username + "/stories"}
          >
            <GalleryHorizontalEnd size={15} /> Hikayeler
          </Link>
        </div>
      </>
    );
  }
};

export default ProfileCard;
