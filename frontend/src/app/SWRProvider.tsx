"use client";
import fetcher from "@/services/fetcher";
import { ReactNode } from "react";
import { SWRConfig } from "swr";

export default function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        // refreshInterval: 3000,
        // revalidateIfStale: false,
        // revalidateOnFocus: false,
        // revalidateOnReconnect: false,
        // revalidateOnMount: false,
        // refreshWhenOffline: false,
        // refreshWhenHidden: false,
        // suspense: true,
        // errorRetryCount: 1,
        // errorRetryInterval: 100,
      }}
    >
      {children}
    </SWRConfig>
  );
}
