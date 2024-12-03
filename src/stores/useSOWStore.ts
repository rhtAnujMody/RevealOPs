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
  currentPage: 1,
  totalPages: 1,
  setSearch: (search) => set({ search }),
  clearSearch: () => set({ search: "" }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setTotalPages: (pages: number) => set({ totalPages: pages }),
  getAllSOW: async (page: number, search?: string, status?: string) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      
      const response = await axios.get(`/api/sows?${params.toString()}`);
      set({ 
        data: response.data.data,
        totalPages: response.data.totalPages,
        currentPage: page
      });
    } catch (error) {
      console.error('Error fetching SOWs:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useSOWStore;
