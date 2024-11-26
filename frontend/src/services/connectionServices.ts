import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { IUser } from "@/types/user";
import { IRequestDetails } from "@/types/connection";

// İstek gönderme
export const SendRequest = () => {
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

// İstek kabul etme
export const AcceptRequest = () => {
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

// İstek reddetme
export const RejectRequest = () => {
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

// Takipten çıkma
export const Unfollow = () => {
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

// Takipçi kaldırma
export const RemoveFollower = () => {
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

// İstek detaylarını alma
export const GetRequestDetails = () => {
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

// Takipçileri alma
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

// Takip edilenleri alma
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
