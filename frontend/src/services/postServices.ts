import { IPost } from "@/types/post";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";

export const GetAllPosts = () => {
  return useQuery<IPost[], Error>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IPost[]>("/post/get-all-posts");
      return data;
    },
  });
};

export const GetUserPosts = (userId: string) => {
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

export const GetPostById = (postId: string) => {
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

export const CreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation<IPost, Error, IPost>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    mutationFn: async (newPost: IPost) => {
      const { data } = await axiosInstance.post<IPost>(
        "/post/create-post",
        newPost
      );
      return data;
    },
  });
};

export const UpdatePost = () => {
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

export const DeletePost = () => {
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
