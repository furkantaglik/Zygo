"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin, useRegister } from "@/services/authServices";
import { useAuthStore } from "@/lib/zustand/authStore";
import { ClipLoader, SyncLoader } from "react-spinners";
import Spinner from "../spinner";

interface LoginFormData {
  email: string;
  username: string;
  password: string;
}

const Register = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    username: "",
    password: "",
  });

  const router = useRouter();
  const { trigger, isMutating } = useRegister();
  const { isAuthenticated, setUser, setToken } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await trigger(formData);
    setUser(response.user);
    setToken(response.token);
    router.push("/");
  };

  return (
    <section className="flex items-center justify-center min-h-screen">
      <div className="border-y sm:border border-accent rounded mx-auto p-5 sm:w-[400px] w-full">
        <h1 className="text-center text-2xl italic font-semibold border-b border-primary mb-10 text-primary">
          Zygo
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-5 mb-5">
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ornek@gmail.com"
              className="bg-transparent ring-0 border-b border-accent outline-none focus:ring focus:ring-accent rounded p-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username" className="font-semibold mb-1">
              Kullanıcı adı
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="------"
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
            disabled={isMutating}
          >
            Kayıt Ol
          </button>
        </form>
        <small>
          Hesabın var mı?{" "}
          <Link href="/auth/login" className="text-primary">
            Giriş Yap
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
