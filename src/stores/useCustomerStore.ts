import constants from "@/lib/constants";
import { TCustomer, TCustomerStore } from "@/lib/model";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";

const useCustomerStore = create<TCustomerStore>((set, get) => ({
  isLoading: false,
  headers: [
    { key: "customer_name", value: "Customer" },
    { key: "contact_first_name", value: "Contact Name" },
    { key: "email_id", value: "Email ID" },
    { key: "contract_type", value: "Type of Contract" },
    { key: "contract_start_date", value: "Start Date" },
    { key: "msa_location", value: "MSA Location" },
  ],
  setLoading: (isLoading) => set({ isLoading: isLoading }),
  data: [],
  search: "",
  currentPage: 1,
  totalPages: 1,
  setSearch: (search) => set({ search: search }),
  setCurrentPage: (page: number) => set({ currentPage: page }),
  setTotalPages: (pages: number) => set({ totalPages: pages }),
  clearSearch: () => set({ search: "" }),
  getAllCustomers: async (page: number = 1) => {
    set({ isLoading: true });
    const response = await apiRequest<TCustomer[]>(
      get().search
        ? `${constants.ALL_CUSTOMERS}?search=${get().search}&page=${page}`
        : `${constants.ALL_CUSTOMERS}?page=${page}`,
      "GET"
    );
    if (response.ok) {
      const totalPages = parseInt(response.headers['total-pages'] || '1');
      set({
        isLoading: false,
        data: response.data || [],
        currentPage: page,
        totalPages: totalPages || 1,
      });
    } else {
      set({ isLoading: false });
    }
  },
}));

export default useCustomerStore;
