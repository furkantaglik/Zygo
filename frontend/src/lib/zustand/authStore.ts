import { IUser } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
  loading: boolean;
  setToken: (value: string | null) => void;
  setUser: (userData: IUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: true,
      setToken: (value) => {
        set({ token: value });
        if (value) {
          set({ isAuthenticated: true, loading: false });
        } else {
          set({ isAuthenticated: false, loading: false });
        }
      },
      setUser: (userData) => {
        set({ user: userData, isAuthenticated: true, loading: false });
      },
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
        }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.loading = false;
        }
      },
    }
  )
);
