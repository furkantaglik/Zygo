import React from "react";

const Avatar = ({ size }: { size: number }) => {
  return (
    <img
      className="rounded-full border-primary border-2"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt47Nkz9791i1h0oVGiXRKnCILIfDkX-wZ_Q&s"
      style={{ width: size, height: size }}
      alt="Avatar"
    />
  );
};

export default Avatar;
