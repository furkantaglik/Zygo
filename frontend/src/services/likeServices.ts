import { ILike } from "@/types/like";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";

export const CreateLike = () => {
  const queryClient = useQueryClient();
  return useMutation<ILike, Error, { postId: string }>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postLikes"] });
    },
    mutationFn: async ({ postId }: { postId: string }) => {
      const { data } = await axiosInstance.post<ILike>("/like/create-like", {
        postId,
      });
      return data;
    },
  });
};

export const DeleteLike = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postLikes"] });
    },
    mutationFn: async (postId: string) => {
      await axiosInstance.get(`/like/delete-like/${postId}`);
    },
  });
};

export const GetPostLikes = (postId: string) => {
  return useQuery<ILike[], Error>({
    queryKey: ["postLikes", postId],
    enabled: !!postId,
    queryFn: async () => {
      const { data } = await axiosInstance.get<ILike[]>(
        `/like/get-post-likes/${postId}`
      );
      return data;
    },
  });
};
