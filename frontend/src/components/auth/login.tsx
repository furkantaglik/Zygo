"use client";
import React, { useState } from "react";
import SubmitButton from "../submitButton";
import Link from "next/link";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { IUser } from "@/types/user";
import {
  useAllPosts,
  useCreatePost,
  useDeletePost,
  useUpdatePost,
} from "@/services/postServices";
import { IPost } from "@/types/post";

interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: "",
    password: "",
  });
  const router = useRouter();

  const { data } = useAllPosts();
  const { trigger } = useDeletePost();
  const post: IPost = {
    _id: "6730ac20a820df3acf577279",
    content: "ssadasd",
    mediaUrl: "dasd",
    mediaType: "image",
  };
  trigger({ postId: "6730ac20a820df3acf577279" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <section className="flex items-center justify-center min-h-screen">
      <div className="border-y sm:border border-secondary rounded mx-auto p-5 sm:w-[400px] w-full">
        <h3 className="text-center border-b mb-10">Zygo</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-5 mb-5">
          <div className="flex flex-col">
            <label htmlFor="emailOrUsername" className="font-semibold mb-1">
              Email veya Kullanıcı Adı
            </label>
            <input
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              placeholder="ornek@gmail.com"
              className="bg-transparent ring-0 border-b border-secondary outline-none focus:ring focus:ring-secondary rounded p-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold mb-1">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="******"
              className="bg-transparent ring-0 border-b border-secondary outline-none focus:ring focus:ring-secondary rounded p-1"
            />
          </div>
          <SubmitButton className="bg-secondary rounded font-semibold p-1">
            Giriş
          </SubmitButton>
        </form>
        <small>
          Hesabın yok mu?{" "}
          <Link href="/auth/register" className="text-secondary">
            Kayıt Ol
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
