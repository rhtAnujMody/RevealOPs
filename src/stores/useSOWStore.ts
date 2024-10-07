import constants from "@/lib/constants";
import { TSOW, TSOWStore } from "@/lib/model";
import { formatDataToHeaders } from "@/lib/utils";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";

const useSOWStore = create<TSOWStore>((set, get) => ({
  isLoading: false,
  headers: [
    { key: "customer_name", value: "Customer Name" },
    { key: "sow_description", value: "Description" },
    { key: "sow_value", value: "SOW Value" },
    { key: "start_date", value: "Start Date" },
    { key: "end_date", value: "End Date" },
  ],
  setLoading: (isLoading) => set({ isLoading: isLoading }),
  data: [],
  search: "",
  setSearch: (search) => set({ search: search }),
  getAllSOW: async () => {
    set({ isLoading: true });
    const response = await apiRequest<TSOW[]>(
      get().search
        ? `${constants.ALL_SOWS}?search=${get().search}`
        : constants.ALL_SOWS,
      "GET"
    );
    if (response.ok) {
      set({
        isLoading: false,
        data: formatDataToHeaders(response.data!, get().headers),
      });
    }
  },
}));

export default useSOWStore;
