import useSWR, { SWRConfiguration } from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Veri alınamadı");
  }
  return response.json();
};

export const useFetch = <T>(url: string, options?: SWRConfiguration) => {
  const { data, error, isLoading } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    ...options,
  });

  return {
    data,
    error,
    isLoading,
    isError: !!error,
  };
};
