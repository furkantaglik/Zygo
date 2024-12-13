"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Compass,
  House,
  MessageCircle,
  Search,
  User,
} from "lucide-react";
import { useAuthStore } from "@/lib/zustand/authStore";
import Avatar from "../user/avatar";
import { useGetUserById } from "@/services/userServices";
import Logo from "./logo";
import SearchUser from "@/components/user/searchUser";

const Navbar = () => {
  const pathname = usePathname();
  const [showSearchModal, setShowSearchModal] = useState(false);

  const menuItems = [
    { href: "/", label: "Ana Sayfa", icon: <House /> },
    { href: "/explore", label: "Keşfet", icon: <Compass /> },
    { href: "/inbox", label: "Mesajlar", icon: <MessageCircle /> },
    { href: "/notifications", label: "Bildirimler", icon: <Bell /> },
  ];

  const isActive = (path: string) =>
    pathname === path
      ? "lg:bg-accent lg:scale-100 scale-110 lg:text-foreground text-accent "
      : "";

  const { user } = useAuthStore();
  const { data: userData } = useGetUserById(user!._id);

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden lg:flex flex-col h-screen w-full border-r border-accent pt-5 sticky top-0">
        <Logo />
        <ul className="mt-5 flex flex-col gap-y-5 text-lg">
          {menuItems.map(({ href, label, icon }) => (
            <Link
              href={href}
              key={href}
              className={`p-2 hover:bg-accent mx-2 rounded cursor-pointer transition-all flex items-center gap-x-2 ${isActive(
                href
              )}`}
            >
              {icon}
              {label}
            </Link>
          ))}
          <li
            onClick={() => setShowSearchModal(true)}
            className="p-2 hover:bg-accent mx-2 rounded cursor-pointer transition-all flex items-center gap-x-2"
          >
            <Search />
            Ara
          </li>
        </ul>
        <Link
          href={`/${userData?.username}`}
          className={`p-2 mb-5 hover:bg-accent mx-2 rounded cursor-pointer transition-all flex items-center gap-x-2 mt-auto text-lg ${isActive(
            "/" + userData?.username
          )}`}
        >
          <Avatar size={30} avatarUrl={userData?.avatar} />
          Profil
        </Link>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 border-t border-accent bg-background z-30">
        <ul className="flex justify-around items-center ">
          {menuItems.map(({ href, label, icon }) => (
            <Link
              href={href}
              key={href}
              className={`hover:scale-110 transition-all ${isActive(href)}`}
            >
              {icon}
            </Link>
          ))}

          <li
            onClick={() => setShowSearchModal(true)}
            className="hover:scale-110 transition-all"
          >
            <Search />
          </li>
          <Link
            href={`/${user?.username}`}
            className={`hover:scale-110 transition-all `}
          >
            <Avatar size={25} avatarUrl={user?.avatar} />
          </Link>
        </ul>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <SearchUser onClose={() => setShowSearchModal(false)} />
      )}
    </>
  );
};

export default Navbar;
