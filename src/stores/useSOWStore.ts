import constants from "@/lib/constants";
import { TSOW, TSOWStore } from "@/lib/model";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";
import axios from "axios";

const useSOWStore = create<TSOWStore>((set, get) => ({
  isLoading: false,
  headers: [
    { key: "sow_id", value: "ID" },
    { key: "customer_name", value: "Customer Name" },
    { key: "sow_description", value: "Description" },
    { key: "start_date", value: "Start Date" },
    { key: "end_date", value: "End Date" },
    { key: "business_unit", value: "Business Unit" },
    { key: "duration", value: "Duration (Weeks)" },
  ],
  setLoading: (isLoading) => set({ isLoading }),
  data: [],
  search: "",
  status: "",
  currentPage: 1,
  totalPages: 1,
  setSearch: (search) => set({ search }),
  clearSearch: () => set({ search: "" }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setTotalPages: (pages: number) => set({ totalPages: pages }),
  setStatus: (status: string) => set({ status }),
  clearStatus: () => set({ status: "" }),
  getAllSOW: async (page: number) => {
    set({ isLoading: true });
    try {
      const currentState = get();
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(currentState.search && { search: currentState.search.trim() }),
        ...(currentState.status && { status: currentState.status })
      });

      const response = await apiRequest<TSOW[]>(
        `${constants.ALL_SOWS}?${queryParams.toString()}`,
        "GET"
      );

      const headers = response.headers as { [key: string]: string };
      const totalPages = parseInt(headers['total-pages'] || '1');
      
      if (response.data) {
        set({
          data: response.data,
          currentPage: page,
          totalPages: totalPages,
        });
        console.log("Updated state:", { currentPage: page, totalPages: totalPages });
      } else {
        console.error("Failed to fetch SOWs: No data received");
        set({ data: [], totalPages: 1 });
      }
    } catch (error) {
      console.error("Error fetching SOWs:", error);
      set({ data: [], totalPages: 1 });
    } finally {
      set({ isLoading: false });
    }
  },
}));
export default useSOWStore;
