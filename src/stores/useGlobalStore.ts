import { TGlobal } from "@/lib/model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGlobalStore = create<TGlobal>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (isAuthenticated: boolean) => {
        console.log("Authentication state changed:", isAuthenticated);
        set({ isAuthenticated });
      },
    }),
    {
      name: "global-store",
    }
  )
);
export default useGlobalStore;
