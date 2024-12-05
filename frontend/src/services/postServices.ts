import { IPost } from "@/types/post";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";

export const useGetAllPosts = () => {
  return useQuery<IPost[], Error>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IPost[]>("/post/get-all-posts");
      return data;
    },
  });
};

export const useGetFollowingPosts = () => {
  return useQuery<IPost[], Error>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IPost[]>(
        "/post/get-following-posts"
      );
      return data;
    },
  });
};

export const useGetUserPosts = (userId: string) => {
  return useQuery<IPost[], Error>({
    queryKey: ["userPosts", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await axiosInstance.get<IPost[]>(
        `/post/get-user-posts/${userId}`
      );
      return data;
    },
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery<IPost, Error>({
    queryKey: ["post", postId],
    enabled: !!postId,
    queryFn: async () => {
      const { data } = await axiosInstance.get<IPost>(
        `/post/get-by-postId/${postId}`
      );
      return data;
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<IPost, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post<IPost>(
        "/post/create-post",
        formData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation<IPost, Error, IPost>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    mutationFn: async (updatedPost: IPost) => {
      const { data } = await axiosInstance.post<IPost>(
        "/post/update-post",
        updatedPost
      );
      return data;
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    mutationFn: async (postId: string) => {
      await axiosInstance.get(`/post/delete-post/${postId}`);
    },
  });
};
