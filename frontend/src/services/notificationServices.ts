import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { INotification } from "@/types/notification";

export const useGetUserNotifications = () => {
  return useQuery<INotification[], Error>({
    queryKey: ["notification"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<INotification[]>(
        `/notification/get-user-notifications`
      );
      return data;
    },
  });
};

export const useMarkAllNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification"] });
    },
    mutationFn: async () => {
      await axiosInstance.get(`/notification/mark-all-notification-as-read`);
    },
  });
};
