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
  setSearch: (search) => set({ search: search }),
  clearSearch: () => set({ search: "" }),
  getAllCustomers: async () => {
    set({ isLoading: true });
    const response = await apiRequest<TCustomer[]>(
      get().search
        ? `${constants.ALL_CUSTOMERS}?search=${get().search}`
        : constants.ALL_CUSTOMERS,
      "GET"
    );
    if (response.ok) {
      set({
        isLoading: false,
        data: response.data || [],
      });
    } else {
      set({ isLoading: false });
    }
  },
}));

export default useCustomerStore;
