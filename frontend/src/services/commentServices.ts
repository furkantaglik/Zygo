import { IComment } from "@/types/comment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";

export const CreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation<IComment, Error, { content: string; postId: string }>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postComments"] });
    },
    mutationFn: async (comment: { content: string; postId: string }) => {
      const { data } = await axiosInstance.post<IComment>(
        "/comment/create-comment",
        comment
      );
      return data;
    },
  });
};

export const UpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation<IComment, Error, IComment>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postComments"] });
    },
    mutationFn: async (updatedComment: IComment) => {
      const { data } = await axiosInstance.post<IComment>(
        "/comment/update-comment",
        updatedComment
      );
      return data;
    },
  });
};

export const DeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postComments"] });
    },
    mutationFn: async (commentId: string) => {
      await axiosInstance.get(`/comment/delete-comment/${commentId}`);
    },
  });
};

export const GetCommentsByPostId = (postId: string) => {
  return useQuery<IComment[], Error>({
    queryKey: ["postComments", postId],
    enabled: !!postId,
    queryFn: async () => {
      const { data } = await axiosInstance.get<IComment[]>(
        `/comment/get-post-comments/${postId}`
      );
      return data;
    },
  });
};
