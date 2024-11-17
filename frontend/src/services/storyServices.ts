import { IStory } from "@/types/story";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";

export const GetAllStories = () => {
  return useQuery<IStory[], Error>({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IStory[]>(
        "/story/get-all-stories"
      );
      return data;
    },
  });
};

export const GetUserStories = (userId: string) => {
  return useQuery<IStory[], Error>({
    queryKey: ["userStories", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await axiosInstance.get<IStory[]>(
        `/story/get-user-stories/${userId}`
      );
      return data;
    },
  });
};

export const CreateStory = () => {
  const queryClient = useQueryClient();
  return useMutation<IStory, Error, IStory>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStories"] });
    },
    mutationFn: async (newStory: IStory) => {
      const { data } = await axiosInstance.post<IStory>(
        "/story/create-story",
        newStory
      );
      return data;
    },
  });
};

export const DeleteStory = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStories"] });
    },
    mutationFn: async (storyId: string) => {
      await axiosInstance.get(`/story/delete-story/${storyId}`);
    },
  });
};
