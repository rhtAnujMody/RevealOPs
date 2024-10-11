import constants from "@/lib/constants";
import { TEmployee, TEmployeeStore, TimelineItem } from "@/lib/model";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";

const useEmployeeStore = create<TEmployeeStore>((set, get) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading: isLoading }),
  data: [] as TEmployee[],
  headers: [],
  search: "",
  setSearch: (search) => set({ search: search }),
  getAllEmployees: async () => {
    set({ isLoading: true });
    const response = await apiRequest<TEmployee[]>(
      get().search
        ? `${constants.ALL_EMPLOYEES}?search=${get().search}`
        : constants.ALL_EMPLOYEES,
      "GET"
    );
    if (response.ok) {
      set({
        isLoading: false,
        data: response.data,
      });
    }
  },
  getEmployeeTimeline: async (employeeId: number) => {
    const response = await apiRequest<TimelineItem[]>(
      constants.EMPLOYEE_TIMELINE.replace('{employee_id}', employeeId.toString()),
      "GET"
    );
    if (response.ok) {
      return response.data || [];
    } else {
      console.error('Failed to fetch timeline:', response.error);
      return [];
    }
  },
}));

export default useEmployeeStore;
