import constants from "@/lib/constants";
import { TEmployee, TEmployeeStore } from "@/lib/model";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";

const useEmployeeStore = create<TEmployeeStore>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading: isLoading }),
  data: [] as TEmployee[],
  getAllEmployees: async () => {
    set({ isLoading: true });
    const response = await apiRequest<TEmployee[]>(
      constants.ALL_EMPLOYEES,
      "GET"
    );
    if (response.ok) {
      set({
        isLoading: false,
        data: response.data,
      });
    }
  },
}));

export default useEmployeeStore;
