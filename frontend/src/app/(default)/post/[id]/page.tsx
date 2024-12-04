"use client";
import NotFound from "@/components/_global/notFound";
import Spinner from "@/components/_global/spinner";
import PostCard from "@/components/post/postCard";
import { useGetPostById } from "@/services/postServices";
import { useParams, useRouter } from "next/navigation";

const PostDetailPage = () => {
  const params = useParams<{ id: string }>();
  const { data: post, isLoading, isError } = useGetPostById(params.id);
  const router = useRouter();

  if (!params || isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <NotFound />;
  }
  return (
    <section>
      <PostCard post={post!} />
    </section>
  );
};

export default PostDetailPage;
