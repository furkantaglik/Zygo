import { IUser } from "@/types/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";

export const UpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<IUser, Error, FormData>({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post<IUser>(
        "/user/update-user",
        formData
        // {
        //   headers: { "Content-Type": "multipart/form-data" },
        // }
      );
      return data;
    },
  });
};

export const GetAllUsers = () => {
  return useQuery<IUser[], Error>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<IUser[]>("/user/get-all-users");
      return data;
    },
  });
};

export const GetUserById = (userId: string) => {
  return useQuery<IUser, Error>({
    queryKey: ["user", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await axiosInstance.get<IUser>(
        `/user/get-by-userId/${userId}`
      );
      return data;
    },
  });
};

export const GetUserByUsername = (username: string) => {
  return useQuery<IUser, Error>({
    queryKey: ["userByUsername", username],
    enabled: !!username,
    queryFn: async () => {
      const { data } = await axiosInstance.get<IUser>(
        `/user/get-by-username/${username}`
      );
      return data;
    },
  });
};

export const GetUserByEmail = (email: string) => {
  return useQuery<IUser, Error>({
    queryKey: ["userByEmail", email],
    enabled: !!email,
    queryFn: async () => {
      const { data } = await axiosInstance.get<IUser>(
        `/user/get-by-email/${email}`
      );
      return data;
    },
  });
};
