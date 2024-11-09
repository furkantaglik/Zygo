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
      ? "lg:bg-secondary lg:scale-100 scale-110 lg:text-foreground text-secondary "
      : "";

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden lg:flex flex-col h-screen w-full border-r border-secondary pt-5">
        <Link href="/">
          <h4 className="ml-4">Zygo</h4>
        </Link>
        <ul className="mt-5 flex flex-col gap-y-5 text-lg">
          {menuItems.slice(0, -1).map(({ href, label, icon }) => (
            <Link
              href={href}
              key={href}
              className={`p-2 hover:bg-secondary mx-2 rounded cursor-pointer transition-all flex items-center gap-x-2 ${isActive(
                href
              )}`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </ul>
        <Link
          href="/profile"
          className={`p-2 mb-5 hover:bg-secondary mx-2 rounded cursor-pointer transition-all flex items-center gap-x-2 mt-auto text-lg ${isActive(
            "/profile"
          )}`}
        >
          <User />
          Profile
        </Link>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 border-t border-primary">
        <ul className="flex justify-around">
          {menuItems.map(({ href, icon }) => (
            <Link
              href={href}
              key={href}
              className={`hover:scale-110 transition-all ${isActive(href)}`}
            >
              {icon}
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
