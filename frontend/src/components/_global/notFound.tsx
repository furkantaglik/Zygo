import { useRouter } from "next/navigation";
import React from "react";

const NotFound = () => {
  const router = useRouter();
  return (
    <section className="flex items-center justify-center h-screen text-center">
      <div className="border border-accent p-5 flex flex-col gap-y-5">
        <h1 className="text-xl font-semibold">Aradığınız İçerik Bulunamadı</h1>

        <button
          onClick={() => router.back()}
          className="font-semibold p-1 bg-primary rounded"
        >
          Geri Dön
        </button>
      </div>
    </section>
  );
};

export default NotFound;
