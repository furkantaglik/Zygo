"use client";
import ProfileCard from "@/components/user/profileCard";
import Spinner from "@/components/spinner";
import React, { ReactNode, useEffect, useState } from "react";

const Layout = ({
  params,
  children,
}: {
  params: { username: string };
  children: ReactNode;
}) => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getUrlParam = async () => {
      const resolvedParams = await params;
      setUsername(resolvedParams.username);
    };
    getUrlParam();
  }, [params]);

  if (!username) {
    return <Spinner />;
  }

  return (
    <>
      <ProfileCard username={username} />

      <main className="max-w-screen-lg mx-auto mt-5">{children}</main>
    </>
  );
};

export default Layout;
