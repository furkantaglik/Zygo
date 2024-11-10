import useSWR, { mutate, SWRResponse } from "swr";
import useSWRMutation from "swr/mutation";
import { axiosInstance } from "./fetcher";
import { IPost } from "@/types/post";
import fetcher from "./fetcher";

const createPost = async (url: string, { arg }: { arg: { post: IPost } }) => {
  await axiosInstance.post(url, arg.post);
};

const deletePost = async (
  url: string,
  { arg }: { arg: { postId: string } }
) => {
  await axiosInstance.get(`${url}/${arg.postId}`);
};

const updatePost = async (url: string, { arg }: { arg: { post: IPost } }) => {
  await axiosInstance.post(url, arg.post);
};

// Hooks ------

export function useGetAllPosts(): SWRResponse<IPost[]> {
  return useSWR("post/get-all-posts", fetcher);
}

export function useGetUserPosts(userId: string): SWRResponse<IPost[]> {
  return useSWR(`post/get-user-posts/${userId}`, fetcher);
}

export function useGetPostById(postId: string): SWRResponse<IPost> {
  return useSWR(`post/get-by-postId/${postId}`, fetcher);
}

export function useCreatePost() {
  const { mutate } = useGetAllPosts();

  return useSWRMutation("post/create-post", createPost, {
    onError(error) {
      console.error("Error creating post", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useUpdatePost() {
  const { mutate } = useGetAllPosts();

  return useSWRMutation("post/update-post", updatePost, {
    onError(error) {
      console.error("Error updating post", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useDeletePost() {
  const { mutate } = useGetAllPosts();

  return useSWRMutation("post/delete-post", deletePost, {
    onError(error) {
      console.error("Error deleting post", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}
