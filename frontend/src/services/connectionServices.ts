import useSWR, { SWRResponse, mutate } from "swr";
import fetcher, { axiosInstance } from "./fetcher";
import { IConnection } from "@/types/connection";
import useSWRMutation from "swr/mutation";

async function sendRequest(
  url: string,
  { arg }: { arg: { receiverId: string } }
) {
  return await axiosInstance.get(`${url}/${arg.receiverId}`);
}

async function acceptRequest(
  url: string,
  { arg }: { arg: { requestId: string } }
) {
  return await axiosInstance.get(`${url}/${arg.requestId}`);
}

async function rejectRequest(
  url: string,
  { arg }: { arg: { requestId: string } }
) {
  return await axiosInstance.get(`${url}/${arg.requestId}`);
}

async function unfollow(url: string, { arg }: { arg: { userId: string } }) {
  return await axiosInstance.get(`${url}/${arg.userId}`);
}

async function removeFollower(
  url: string,
  { arg }: { arg: { userId: string } }
) {
  return await axiosInstance.get(`${url}/${arg.userId}`);
}

// Hooks ------

export function useGetFollowing(userId: string): SWRResponse<IConnection[]> {
  return useSWR(`connection/get-following/${userId}`, fetcher);
}

export function useGetFollowers(
  userId: string | undefined
): SWRResponse<IConnection[]> {
  return useSWR(userId ? `connection/get-followers/${userId}` : null, fetcher);
}

export function useGetRequests(): SWRResponse<IConnection[]> {
  return useSWR(`connection/get-requests`, fetcher);
}

export function useSendRequest() {
  const { mutate } = useGetRequests();
  return useSWRMutation("connection/send-request", sendRequest, {
    onError(error) {
      console.error("Error sending request", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useAcceptRequest() {
  const { mutate } = useGetRequests();
  return useSWRMutation("connection/accept-request", acceptRequest, {
    onError(error) {
      console.error("Error accepting request", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useRejectRequest() {
  const { mutate } = useGetRequests();
  return useSWRMutation("connection/reject-request", rejectRequest, {
    onError(error) {
      console.error("Error rejecting request", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useUnfollow(userId: string) {
  const { mutate } = useGetFollowing(userId);
  return useSWRMutation("connection/unfollow", unfollow, {
    onError(error) {
      console.error("Error unfollowing user", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}

export function useRemoveFollower(userId: string) {
  const { mutate } = useGetFollowers(userId);
  return useSWRMutation("connection/remove-follower", removeFollower, {
    onError(error) {
      console.error("Error removing follower", error);
    },
    onSuccess: () => {
      mutate();
    },
  });
}
