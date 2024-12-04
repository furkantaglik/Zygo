"use client";
import ProfileCard from "@/components/user/profileCard";
import Spinner from "@/components/_global/spinner";
import React, { ReactNode, useEffect, useState } from "react";
import { useGetUserByUsername } from "@/services/userServices";
import { useParams } from "next/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const { data: userData, isLoading } = useGetUserByUsername(username!);
  const params = useParams<{ username: string }>();

  useEffect(() => {
    const getUrlParam = async () => {
      setUsername(params.username);
    };
    getUrlParam();
  }, [params]);

  if (!username || isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <ProfileCard userData={userData!} />

      <main className="max-w-screen-lg mx-auto mt-5">{children}</main>
    </>
  );
};

export default Layout;
