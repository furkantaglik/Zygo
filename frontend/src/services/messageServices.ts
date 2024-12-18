import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { IMessage } from "@/types/message";
import { IUser } from "@/types/user";

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<IMessage, Error, { content: string; receiverId: string }>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message"] });
    },
    mutationFn: async ({ content, receiverId }) => {
      const { data } = await axiosInstance.post<IMessage>(
        "/message/send-message",
        {
          content,
          receiver: receiverId,
        }
      );
      return data;
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message"] });
    },
    mutationFn: async (messageId: string) => {
      await axiosInstance.delete(`/message/delete-message/${messageId}`);
    },
  });
};

export const useGetMessages = (userId: string) => {
  return useQuery<IMessage[], Error>({
    queryKey: ["message"],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await axiosInstance.get<IMessage[]>(
        `/message/get-messages/${userId}`
      );
      return data;
    },
  });
};
export const useGetUnreadMessages = () => {
  return useQuery<IMessage[], Error>({
    queryKey: ["message"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IMessage[]>(
        `/message/get-unread-messages`
      );
      return data;
    },
  });
};

export const useGetInbox = () => {
  return useQuery<IUser[], Error>({
    queryKey: ["inbox"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IUser[]>(`/message/get-inbox`);
      return data;
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message"] });
    },
    mutationFn: async (targetUserId: string) => {
      await axiosInstance.get(`/message/mark-messages-as-read/${targetUserId}`);
    },
  });
};
