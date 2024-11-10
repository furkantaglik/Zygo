import useSWR, { SWRResponse, mutate } from "swr";
import { axiosInstance } from "./fetcher";
import { IStory } from "@/types/story";
import fetcher from "./fetcher";
import useSWRMutation from "swr/mutation";

const createStory = async (
  url: string,
  { arg }: { arg: { story: IStory } }
) => {
  await axiosInstance.post(url, arg.story);
};

const deleteStory = async (
  url: string,
  { arg }: { arg: { storyId: string } }
) => {
  await axiosInstance.get(`${url}/${arg.storyId}`);
};

// Hooks ------

export function useGetAllStories(): SWRResponse<IStory[]> {
  return useSWR("story/get-all-stories", fetcher);
}

export function useGetUserStories(userId: string): SWRResponse<IStory[]> {
  return useSWR(`story/get-user-stories/${userId}`, fetcher);
}

export function useCreateStory() {
  const { mutate } = useGetAllStories();
  return useSWRMutation("story/create-story", createStory, {
    onError(error) {
      console.error("Error creating story", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useDeleteStory() {
  const { mutate } = useGetAllStories();
  return useSWRMutation("story/delete-story", deleteStory, {
    onError(error) {
      console.error("Error deleting story", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}
