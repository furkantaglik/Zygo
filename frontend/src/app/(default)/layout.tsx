"use client";
import ProtectedLayout from "@/components/auth/protectedLayout";
import Navbar from "@/components/_global/navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout>
      <section className="grid grid-cols-12 max-w-screen-2xl mx-auto">
        <nav className="col-span-2">
          <Navbar />
        </nav>

        <section className="col-span-12 lg:col-span-10 lg:px-0 px-1 lg:pt-5 mb-10 lg:mx-5 md:pt-0 pt-2">
          {children}
        </section>
      </section>
    </ProtectedLayout>
  );
}
