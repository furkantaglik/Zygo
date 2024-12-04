"use client";
import React from "react";
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

const Navbar = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Ana Sayfa", icon: <House /> },
    { href: "/search", label: "Ara", icon: <Search /> },
    { href: "/explore", label: "Keşfet", icon: <Compass /> },
    { href: "/messages", label: "Mesajlar", icon: <MessageCircle /> },
    { href: "/notifications", label: "Bildirimler", icon: <Bell /> },
    { href: "/profile", label: "Profil", icon: <User /> },
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
        <Link href="/">
          <h4 className="ml-4 text-3xl font-semibold italic text-primary">
            Zygo
          </h4>
        </Link>
        <ul className="mt-5 flex flex-col gap-y-5 text-lg">
          {menuItems.slice(0, -1).map(({ href, label, icon }) => (
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
        </ul>
        <Link
          href={`/${userData?.username}`}
          className={`p-2 mb-5 hover:bg-accent mx-2 rounded cursor-pointer transition-all flex items-center gap-x-2 mt-auto text-lg ${isActive(
            "/" + userData?.username
          )}`}
        >
          <Avatar size={30} avatarUrl={userData?.avatar} />
          Profile
        </Link>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 border-t border-accent bg-background z-30">
        <ul className="flex justify-around">
          {menuItems.slice(0, -1).map(({ href, label, icon }) => (
            <Link
              href={href}
              key={href}
              className={`hover:scale-110 transition-all ${isActive(href)}`}
            >
              {icon}
            </Link>
          ))}
          <Link
            href={`/${userData?.username}`}
            className={`hover:scale-110 transition-all`}
          >
            <Avatar size={30} avatarUrl={userData?.avatar} />
          </Link>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
