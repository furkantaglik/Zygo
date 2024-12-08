import { IStory } from "@/types/story";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";

export const useGetAllStories = () => {
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
export const useGetFollowingStories = () => {
  return useQuery<IStory[], Error>({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IStory[]>(
        "/story/get-following-stories"
      );
      return data;
    },
  });
};

export const useGetuserStories = (userId: string) => {
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

export const useCreateStory = () => {
  const queryClient = useQueryClient();
  return useMutation<IStory, Error, FormData>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStories"] });
    },
    mutationFn: async (newStory: FormData) => {
      const { data } = await axiosInstance.post<IStory>(
        "/story/create-story",
        newStory
      );
      return data;
    },
  });
};

export const useDeleteStory = () => {
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
