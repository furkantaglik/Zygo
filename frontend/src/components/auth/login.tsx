"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/services/authServices";
import { useAuthStore } from "@/lib/zustand/authStore";

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
  const { mutateAsync, isPending } = useLogin();
  const { setUser, setToken } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { emailOrUsername, password } = formData;
    const response = await mutateAsync({ emailOrUsername, password });
    if (response) {
      const { user, token } = response;
      setUser(user);
      setToken(token);
      router.push("/");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen">
      <div className="border-y sm:border border-accent rounded mx-auto p-5 sm:w-[400px] w-full">
        <h1 className="text-center text-2xl italic font-semibold border-b border-primary mb-10 text-primary">
          Zygo
        </h1>
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
              className="bg-transparent ring-0 border-b border-accent outline-none focus:ring focus:ring-accent rounded p-1"
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
              className="bg-transparent ring-0 border-b border-accent outline-none focus:ring focus:ring-accent rounded p-1"
            />
          </div>
          <button
            type="submit"
            className="p-1 bg-accent rounded font-semibold"
            disabled={isPending}
          >
            Giriş Yap
          </button>
        </form>
        <small>
          Hesabın yok mu?{" "}
          <Link href="/auth/register" className="text-primary">
            Kayıt Ol
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
