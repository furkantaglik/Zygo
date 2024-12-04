"use client";

import React, { useState, useRef, useEffect } from "react";
import Modal from "../_global/modal"; // Modal bileşeni
import { useGetAllUsers } from "@/services/userServices";
import Spinner from "../_global/spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserCard from "./userCard";

const SearchUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: users, isLoading } = useGetAllUsers();

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  const filteredUsers = searchQuery
    ? users?.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleClose = () => {
    setIsModalOpen(false);
    return router.back();
  };

  return (
    <>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleClose} title="Kullanıcı Ara">
          <div>
            <input
              type="text"
              placeholder="Kullanıcı adı"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-accent rounded bg-background outline-none"
              ref={inputRef}
            />
            <ul className="mt-4">
              {isLoading && <Spinner />}
              <div className="flex flex-col gap-y-3">
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <UserCard key={user._id} user={user} />
                  ))
                ) : searchQuery ? (
                  <li className="text-gray-500">Sonuç bulunamadı</li>
                ) : null}
              </div>
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SearchUser;
