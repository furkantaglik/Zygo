"use client";
import Spinner from "@/components/_global/spinner";
import Avatar from "@/components/user/avatar";
import { useAuthStore } from "@/lib/zustand/authStore";
import { GetUserById, UpdateUser } from "@/services/userServices";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { user, loading } = useAuthStore();
  const { data: userData, isLoading } = GetUserById(user!._id);
  const { mutate, isPending } = UpdateUser();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null | undefined>(
    null
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    bio: "",
    id: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        email: userData.email || "",
        bio: userData.bio || "",
        id: user!._id,
      });
      setAvatarPreview(userData.avatar);
    }
  }, [userData, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const handleAvatarClick = () => {
    document.getElementById("avatarInput")?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("user", JSON.stringify(formData));
    if (avatarFile) data.append("image", avatarFile);

    mutate(data);
    toast.success("Profil Güncellendi");
  };

  if (loading || isLoading) return <Spinner />;

  return (
    <section className="max-w-screen-md mx-auto md:border border-accent rounded md:p-3 pt-3 mb-10">
      <h1 className="text-lg font-semibold text-center">Profili Düzenle</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:mx-10 mt-5 gap-y-10"
      >
        <div className="flex flex-col mx-auto">
          <div className="cursor-pointer" onClick={handleAvatarClick}>
            <Avatar size={250} avatarUrl={avatarPreview} />
          </div>
          <input
            type="file"
            className="hidden"
            id="avatarInput"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="firstName" className="font-semibold mb-1 text-lg">
            İsim
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="bg-transparent ring-0 border-b border-primary outline-none rounded p-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="lastName" className="font-semibold mb-1 text-lg">
            Soyisim
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="bg-transparent ring-0 border-b border-primary outline-none rounded p-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="username" className="font-semibold mb-1 text-lg">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="bg-transparent ring-0 border-b border-primary outline-none rounded p-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="font-semibold mb-1 text-lg">
            Email
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-transparent ring-0 border-b border-primary outline-none rounded p-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="bio" className="font-semibold mb-1 text-lg">
            Bio
          </label>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="bg-transparent ring-0 border-b border-primary outline-none rounded p-1"
          />
        </div>
        <div className="">
          <button
            type="submit"
            disabled={isPending}
            className="px-3 h-[40px] w-full mx-auto bg-accent rounded font-semibold"
          >
            {isPending ? <Spinner /> : "Güncelle"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProfile;
