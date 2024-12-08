import { ISave } from "@/types/save";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";

export const useGetUserSaves = () => {
  return useQuery<ISave[], Error>({
    queryKey: ["userSaves"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ISave[]>("/save/get-user-saves");
      return data;
    },
  });
};

export const useCreateSave = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (postId: string) => {
      await axiosInstance.get(`/save/create-save/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSaves"] });
    },
  });
};

export const useDeleteSave = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (postId: string) => {
      await axiosInstance.get(`/save/delete-save/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSaves"] });
    },
  });
};
