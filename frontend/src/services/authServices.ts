import useSWRMutation from "swr/mutation";
import { axiosInstance } from "./fetcher";

const registerRequest = async (
  url: string,
  { arg }: { arg: { username: string; email: string; password: string } }
) => {
  return (await axiosInstance.post(url, { ...arg })).data;
};

const loginRequest = async (
  url: string,
  { arg }: { arg: { emailOrUsername: string; password: string } }
) => {
  return (await axiosInstance.post(url, { ...arg })).data;
};

export function useRegister() {
  return useSWRMutation("/auth/register", registerRequest, {
    onError(error) {
      console.error("Error registering user", error);
    },
    onSuccess: (data) => {
      console.log("User registered successfully", data);
    },
  });
}

export function useLogin() {
  return useSWRMutation("/auth/login", loginRequest, {
    onError(error) {
      console.error("Error logging in", error);
    },
    onSuccess(data) {},
  });
}
