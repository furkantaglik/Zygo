import { useAuthStore } from "@/lib/zustand/authStore";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType, PropsWithChildren } from "react";
import Spinner from "../_global/spinner";

const withAuth = <P extends object>(Component: ComponentType<P>) => {
  return (props: PropsWithChildren<P>) => {
    const { isAuthenticated, loading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/auth/login");
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return <Spinner />;
    }

    return isAuthenticated ? <Component {...props} /> : <Spinner />;
  };
};

export default withAuth;
