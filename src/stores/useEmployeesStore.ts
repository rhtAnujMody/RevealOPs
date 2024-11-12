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
  getAllEmployees: async (date: string) => {
    set({ isLoading: true });
    try {
      const response = await apiRequest(
        `${constants.ALL_EMPLOYEES}?date=${date}`,
        'GET'
      );
      if (response.ok) {
        set({ data: response.data, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      set({ isLoading: false });
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
