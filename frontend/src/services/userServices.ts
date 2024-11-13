import useSWR, { SWRResponse } from "swr";
import { IUser } from "@/types/user";
import fetcher from "./fetcher";

// Hooks ------

export function useGetAllUsers(): SWRResponse<IUser[]> {
  return useSWR("user/get-all-users", fetcher);
}

export function useGetUserById(userId: string): SWRResponse<IUser> {
  return useSWR(`user/get-by-userId/${userId}`, fetcher);
}

export function useGetUserByUsername(username: string): SWRResponse<IUser> {
  return useSWR(`user/get-by-username/${username}`, fetcher);
}

export function useGetUserByEmail(email: string): SWRResponse<IUser> {
  return useSWR(`user/get-by-email/${email}`, fetcher);
}
