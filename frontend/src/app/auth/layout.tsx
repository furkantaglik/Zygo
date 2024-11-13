"use client";
import Spinner from "@/components/spinner";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.back();
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <Spinner />;
  }

  return !isAuthenticated ? <section>{children}</section> : <Spinner />;
}
