import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { IUser } from "@/types/user";
import { IConnection } from "@/types/connection";

export const SendRequest = () => {
  return useMutation<void, Error, { receiverId: string }>({
    mutationFn: async ({ receiverId }: { receiverId: string }) => {
      await axiosInstance.get(`/connection/send-request/${receiverId}`);
    },
  });
};

export const AcceptRequest = () => {
  return useMutation<void, Error, { requestId: string }>({
    mutationFn: async ({ requestId }: { requestId: string }) => {
      await axiosInstance.get(`/connection/accept-request/${requestId}`);
    },
  });
};

export const RejectRequest = () => {
  return useMutation<void, Error, { requestId: string }>({
    mutationFn: async ({ requestId }: { requestId: string }) => {
      await axiosInstance.get(`/connection/reject-request/${requestId}`);
    },
  });
};

export const Unfollow = () => {
  return useMutation<void, Error, { userId: string }>({
    mutationFn: async ({ userId }: { userId: string }) => {
      await axiosInstance.get(`/connection/unfollow/${userId}`);
    },
  });
};

export const RemoveFollower = () => {
  return useMutation<void, Error, { userId: string }>({
    mutationFn: async ({ userId }: { userId: string }) => {
      await axiosInstance.get(`/connection/remove-follower/${userId}`);
    },
  });
};

export const GetRequests = () => {
  return useQuery<IConnection[], Error>({
    queryKey: ["requests"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IConnection[]>(
        "/connection/get-requests"
      );
      return data;
    },
  });
};

export const GetFollowers = (userId: string) => {
  return useQuery<IUser[], Error>({
    queryKey: ["followers", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await axiosInstance.get<IUser[]>(
        `/connection/get-followers/${userId}`
      );
      return data;
    },
  });
};

export const GetFollowing = (userId: string) => {
  return useQuery<IUser[], Error>({
    queryKey: ["following", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await axiosInstance.get<IUser[]>(
        `/connection/get-following/${userId}`
      );
      return data;
    },
  });
};
