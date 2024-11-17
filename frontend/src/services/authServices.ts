import { IUser } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "./axios";

export const useRegister = () => {
  return useMutation<
    ILoginResponse,
    Error,
    { username: string; password: string; email: string }
  >({
    mutationFn: async ({ username, password, email }) => {
      const { data } = await axiosInstance.post<ILoginResponse>(
        "/auth/register",
        {
          username,
          password,
          email,
        }
      );
      return data;
    },
  });
};

export const useLogin = () => {
  return useMutation<
    ILoginResponse,
    Error,
    { emailOrUsername: string; password: string }
  >({
    mutationFn: async ({ emailOrUsername, password }) => {
      const { data } = await axiosInstance.post<ILoginResponse>("/auth/login", {
        emailOrUsername,
        password,
      });
      return data;
    },
  });
};

interface ILoginResponse {
  user: IUser;
  token: string;
}
