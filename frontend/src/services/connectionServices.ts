import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { IUser } from "@/types/user";
import { IRequestDetails } from "@/types/connection";

export const useSendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { receiverId: string }>({
    mutationFn: async ({ receiverId }: { receiverId: string }) => {
      await axiosInstance.get(`/connection/send-request/${receiverId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userByUsername"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });
};

export const useAcceptRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { requestId: string }>({
    mutationFn: async ({ requestId }: { requestId: string }) => {
      await axiosInstance.get(`/connection/accept-request/${requestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userByUsername"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { requestId: string }>({
    mutationFn: async ({ requestId }: { requestId: string }) => {
      await axiosInstance.get(`/connection/reject-request/${requestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};

export const useUnfollow = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { userId: string }>({
    mutationFn: async ({ userId }: { userId: string }) => {
      await axiosInstance.get(`/connection/unfollow/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["userByUsername"] });
    },
  });
};

export const useRemoveFollower = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { userId: string }>({
    mutationFn: async ({ userId }: { userId: string }) => {
      await axiosInstance.get(`/connection/remove-follower/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["userByUsername"] });
    },
  });
};

export const useGetRequestDetails = () => {
  return useQuery<IRequestDetails, Error>({
    queryKey: ["requests"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IRequestDetails>(
        "/connection/get-requests-details"
      );
      return data;
    },
  });
};

export const useGetFollowers = (userId: string) => {
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

export const useGetFollowing = (userId: string) => {
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
