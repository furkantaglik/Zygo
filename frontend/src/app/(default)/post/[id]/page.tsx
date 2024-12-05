"use client";
import { useState, useEffect } from "react";
import NotFound from "@/components/_global/notFound";
import Spinner from "@/components/_global/spinner";
import PostCard from "@/components/post/postCard";
import { useGetPostById, useGetUserPosts } from "@/services/postServices";
import { useParams, useRouter } from "next/navigation";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

const PostDetailPage = () => {
  const params = useParams<{ id: string }>();
  const {
    data: post,
    isLoading: isPostLoading,
    isError,
  } = useGetPostById(params.id);
  const { data: userPosts, isLoading: isUserPostsLoading } = useGetUserPosts(
    post?.user._id || ""
  );
  const router = useRouter();
  const [currentPostIndex, setCurrentPostIndex] = useState<number | null>(null);

  useEffect(() => {
    if (userPosts && params?.id) {
      const index = userPosts.findIndex((p) => p._id === params.id);
      setCurrentPostIndex(index);
    }
  }, [userPosts, params?.id]);

  const handleNext = () => {
    if (
      userPosts &&
      currentPostIndex !== null &&
      currentPostIndex < userPosts.length - 1
    ) {
      const nextPost = userPosts[currentPostIndex + 1];
      router.push(`/post/${nextPost._id}`);
    }
  };

  const handlePrev = () => {
    if (userPosts && currentPostIndex !== null && currentPostIndex > 0) {
      const prevPost = userPosts[currentPostIndex - 1];
      router.push(`/post/${prevPost._id}`);
    }
  };

  if (!params || isPostLoading || isUserPostsLoading) {
    return <Spinner />;
  }
  if (isError || !userPosts || currentPostIndex === null) {
    return <NotFound />;
  }

  return (
    <section className="relative flex items-center justify-center  ">
      {currentPostIndex !== 0 && (
        <button
          className="absolute left-0 transform -translate-y-1/2 top-1/2 p-4 hover:text-primary"
          onClick={handlePrev}
        >
          <ArrowBigLeft size={32} />
        </button>
      )}

      <div className="flex justify-center items-center">
        <PostCard post={post!} />
      </div>

      {currentPostIndex !== userPosts.length - 1 && (
        <button
          className="absolute right-0 transform -translate-y-1/2 top-1/2 p-4 hover:text-primary"
          onClick={handleNext}
        >
          <ArrowBigRight size={32} />
        </button>
      )}
    </section>
  );
};

export default PostDetailPage;
