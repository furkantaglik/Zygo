"use client";
import PostImageCard from "@/components/post/postImageCard";
import Spinner from "@/components/_global/spinner";
import { useGetUserPosts } from "@/services/postServices";
import { usePathname } from "next/navigation";
import { useGetUserByUsername } from "@/services/userServices";
import Link from "next/link";

export default function PostPage() {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/+/, "");
  const { data: userData } = useGetUserByUsername(normalizedPathname);
  const { data, isLoading } = useGetUserPosts(userData!._id);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="grid grid-cols-3 gap-2">
        {data?.map((post) => (
          <Link key={post._id} href={`/post/${post._id}`}>
            <PostImageCard post={post} />
          </Link>
        ))}
      </section>
    </>
  );
}
