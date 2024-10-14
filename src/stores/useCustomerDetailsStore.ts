import constants from "@/lib/constants";
import { TCustomer, TCustomerDetailsStore } from "@/lib/model";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";

const useCustomerDetailsStore = create<TCustomerDetailsStore>((set, get) => ({
  isLoading: false,
  id: "",
  setId: (id) => set({ id }),
  setLoading: (isLoading) => set({ isLoading }),
  data: {} as TCustomer,
  getCustomerDetails: async () => {
    const id = get().id;
    if (!id) {
      console.error("Customer ID is undefined");
      return;
    }
    set({ isLoading: true });
    try {
      const response = await apiRequest<TCustomer>(
        `${constants.ALL_CUSTOMERS}${id}/`,
        "GET"
      );
      if (response.ok) {
        set({
          isLoading: false,
          data: response.data,
        });
      } else {
        console.error("Failed to fetch customer details:", response.error);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
      set({ isLoading: false });
    }
  },
}));

export default useCustomerDetailsStore;
