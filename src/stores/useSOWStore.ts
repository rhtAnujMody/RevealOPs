import constants from "@/lib/constants";
import { TSOW, TSOWStore } from "@/lib/model";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";

const ITEMS_PER_PAGE = 10; // Adjust this value based on your API's pagination setup

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
  currentPage: 1,
  totalPages: 1,
  setSearch: (search) => set({ search }),
  clearSearch: () => set({ search: "" }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setTotalPages: (pages: number) => set({ totalPages: pages }),
  getAllSOW: async (page: number) => {
    set({ isLoading: true });
    try {
      const response = await apiRequest<TSOW[]>(
        `${constants.ALL_SOWS}?page=${page}${get().search ? `&search=${get().search}` : ''}`,
        "GET"
      );
      console.log("API Response Headers:", response.headers);
      if (response.data) {
        const totalPages = parseInt(response.headers['total-pages'] || '1');
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
