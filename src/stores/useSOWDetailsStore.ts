import constants from "@/lib/constants";
import { TSOWDetailsStore, TSOW } from "@/lib/model";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";

const useSOWDetailsStore = create<TSOWDetailsStore>((set, get) => ({
  isLoading: false,
  id: "",
  setId: (id) => {
    console.log("Setting SOW ID:", id);
    set({ id: id });
  },
  setLoading: (isLoading) => set({ isLoading: isLoading }),
  data: {} as TSOW,
  getSOWDetails: async () => {
    const id = get().id;
    console.log("Fetching SOW details for ID:", id);
    if (!id) {
      console.error("SOW ID is undefined");
      return;
    }
    set({ isLoading: true });
    try {
      const response = await apiRequest<TSOW>(
        `${constants.ALL_SOWS}${id}/`,
        "GET"
      );
      if (response.ok) {
        console.log("SOW details fetched successfully:", response.data);
        set({
          isLoading: false,
          data: response.data,
        });
      } else {
        console.error("Failed to fetch SOW details:", response.error);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching SOW details:", error);
      set({ isLoading: false });
    }
  },
}));

export default useSOWDetailsStore;
