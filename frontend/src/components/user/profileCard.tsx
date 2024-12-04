"use client";
import { useAuthStore } from "@/lib/zustand/authStore";
import Avatar from "./avatar";
import {
  LayoutPanelTop,
  Pin,
  GalleryHorizontalEnd,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IUser } from "@/types/user";
import Modal from "../_global/modal";
import NewPost from "../post/newPost";
import { useEffect, useState } from "react";
import { Image } from "lucide-react";
import ProfileConnectionCard from "../connection/profileConnectionCard";

const ProfileCard = ({ userData }: { userData: IUser }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleOpen = () => {
    router.push("?tab=newPost");
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    router.push("/login");
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    setIsModalOpen(tab === "newPost");
  }, [searchParams]);

  return (
    <>
      <section className="grid lg:grid-cols-12 grid-cols-1 gap-y-3 border-b border-accent pb-5 max-w-screen-lg mx-auto">
        <div className="lg:col-span-3 mx-auto">
          <Avatar size={150} avatarUrl={userData.avatar} />
        </div>
        <div className="lg:col-span-9 flex flex-col gap-y-5 w-full items-center lg:items-start">
          <div className="text-xl font-semibold flex items-center gap-x-4 md:w-full ">
            <h1>{userData.username}</h1>
            {currentUser && currentUser._id === userData._id && (
              <div className="flex justify-end gap-x-2 w-full">
                <Link
                  href="/account"
                  className="flex items-center p-1  rounded font-bold text-sm gap-x-1"
                >
                  <Settings size={20} />
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="text-sm flex items-center gap-x-1"
                >
                  <LogOut />
                </button>
              </div>
            )}
          </div>
          <ProfileConnectionCard userData={userData} />
          <div>
            <h3 className="text-center lg:text-start">
              {userData.firstName} {userData.lastName}
            </h3>
            <small className="italic">{userData.bio}</small>
          </div>
          {/* New Post */}
          {currentUser?._id === userData._id && (
            <section>
              <div className="flex">
                <button
                  onClick={handleOpen}
                  className="border border-accent font-semibold rounded flex p-1 gap-x-1"
                >
                  <Image /> +
                </button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={handleClose}
                  title="Yeni Gönderi"
                >
                  <NewPost />
                </Modal>
              </div>
            </section>
          )}
        </div>
      </section>

      <div className="flex mx-auto justify-between max-w-lg">
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

      {/* Logout Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={handleCancelLogout}
        title="Çıkış Yap"
        footer={
          <>
            <button
              onClick={handleCancelLogout}
              className="px-4 py-2 bg-accent rounded"
            >
              Hayır
            </button>
            <button
              onClick={handleConfirmLogout}
              className="px-4 py-2 bg-primary rounded"
            >
              Evet
            </button>
          </>
        }
      >
        <p>Hesabınızdan çıkış yapmak üzeresiniz. Emin misiniz?</p>
      </Modal>
    </>
  );
};
export default ProfileCard;
