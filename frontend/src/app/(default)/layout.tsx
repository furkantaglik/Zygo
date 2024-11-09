import Navbar from "@/components/navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="grid grid-cols-12 max-w-screen-2xl mx-auto">
      <nav className="col-span-2">
        <Navbar />
      </nav>

      <section className="col-span-12 lg:col-span-10 md:px-0 px-1 lg:pt-5 lg:pl-10">
        {children}
      </section>
    </section>
  );
}
