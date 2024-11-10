import useSWR, { mutate, SWRResponse } from "swr";
import useSWRMutation from "swr/mutation";
import { axiosInstance } from "./fetcher";
import { IComment } from "@/types/comment";
import fetcher from "./fetcher";

const createComment = async (
  url: string,
  { arg }: { arg: { comment: IComment } }
) => {
  await axiosInstance.post(url, arg.comment);
};

const updateComment = async (
  url: string,
  { arg }: { arg: { comment: IComment } }
) => {
  await axiosInstance.post(url, arg.comment);
};

const deleteComment = async (
  url: string,
  { arg }: { arg: { commentId: string } }
) => {
  await axiosInstance.get(`${url}/${arg.commentId}`);
};

// Hooks ------

export function useGetComments(postId: string): SWRResponse<IComment[]> {
  return useSWR(`comment/get-post-comments/${postId}`, fetcher);
}

export function useCreateComment(postId: string) {
  const { mutate } = useGetComments(postId);

  return useSWRMutation("comment/create-comment", createComment, {
    onError(error) {
      console.error("Error creating comment", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useUpdateComment(postId: string) {
  const { mutate } = useGetComments(postId);

  return useSWRMutation("comment/update-comment", updateComment, {
    onError(error) {
      console.error("Error updating comment", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useDeleteComment(postId: string) {
  const { mutate } = useGetComments(postId);

  return useSWRMutation("comment/delete-comment", deleteComment, {
    onError(error) {
      console.error("Error deleting comment", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}
