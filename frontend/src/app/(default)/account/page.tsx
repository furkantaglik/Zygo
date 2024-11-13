"use client";
import Spinner from "@/components/spinner";
import Avatar from "@/components/user/avatar";
import { useAuthStore } from "@/lib/zustand/authStore";
import { useGetUserById } from "@/services/userServices";
import React from "react";

const AccountPage = () => {
  const { user, loading } = useAuthStore();
  const { data: userData, isLoading } = useGetUserById(user!._id);

  if (loading || isLoading) {
    <Spinner />;
  }
  return (
    <section className="max-w-screen-md mx-auto md:border border-accent rounded md:p-3 pt-3 mb-10">
      <h1 className="text-lg font-semibold text-center   ">Profili Düzenle</h1>
      <form className="flex flex-col w-96 mx-auto mt-5 gap-y-10">
        <div className="flex flex-col mx-auto">
          <Avatar size={250} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="firstName" className="font-semibold mb-1 text-lg ">
            İsim
          </label>
          <input
            type="text"
            name="firstName"
            placeholder={userData?.firstName}
            className="bg-transparent ring-0  border-b border-primary outline-none rounded p-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="lastName" className="font-semibold mb-1 text-lg ">
            Soyisim
          </label>
          <input
            type="text"
            name="lastName"
            placeholder={userData?.lastName}
            className="bg-transparent ring-0  border-b border-primary outline-none rounded p-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="username" className="font-semibold mb-1 text-lg ">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            name="username"
            placeholder={userData?.username}
            className="bg-transparent ring-0  border-b border-primary outline-none rounded p-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="font-semibold mb-1 text-lg ">
            Email
          </label>
          <input
            type="text"
            name="email"
            placeholder={userData?.email}
            className="bg-transparent ring-0  border-b border-primary outline-none rounded p-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="firstName" className="font-semibold mb-1 text-lg ">
            Bio
          </label>
          <input
            type="text"
            name="firstName"
            placeholder={userData?.bio}
            className="bg-transparent ring-0  border-b border-primary outline-none rounded p-1"
          />
        </div>
        <div>
          <button className="px-3 py-2 w-full bg-accent rounded font-semibold">
            Güncelle{" "}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AccountPage;
