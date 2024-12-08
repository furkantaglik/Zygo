"use client";
import SearchUser from "@/components/user/searchUser";
import { useState } from "react";

const SearchPage = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  return <SearchUser onClose={() => setShowSearchModal(false)} />;
};

export default SearchPage;
