import useSWR, { SWRResponse, mutate } from "swr";
import { axiosInstance } from "./fetcher";
import { ILike } from "@/types/like";
import fetcher from "./fetcher";
import useSWRMutation from "swr/mutation";

const createLike = async (url: string, { arg }: { arg: { like: ILike } }) => {
  await axiosInstance.post(url, arg.like);
};

const deleteLike = async (
  url: string,
  { arg }: { arg: { likeId: string } }
) => {
  await axiosInstance.get(`${url}/${arg.likeId}`);
};

// Hooks ------

export function useGetPostLikes(postId: string): SWRResponse<ILike[]> {
  return useSWR(`like/get-post-likes/${postId}`, fetcher);
}

export function useCreateLike(postId: string) {
  const { mutate } = useGetPostLikes(postId);
  return useSWRMutation("like/create-like", createLike, {
    onError(error) {
      console.error("Error creating like", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useDeleteLike(postId: string) {
  const { mutate } = useGetPostLikes(postId);
  return useSWRMutation("like/delete-like", deleteLike, {
    onError(error) {
      console.error("Error deleting like", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}
