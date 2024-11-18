import constants from "@/lib/constants";
import { TEmployee, TEmployeeStore, TimelineItem } from "@/lib/model";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";
import { toast } from "react-hot-toast";

type GetEmployeesParams = {
  date: string;
  search: string;
};

const useEmployeeStore = create<TEmployeeStore>((set, get) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading: isLoading }),
  data: [] as TEmployee[],
  headers: [],
  search: "",
  setSearch: (search) => set({ search: search }),
  getAllEmployees: async ({ date, search }: GetEmployeesParams) => {
    set({ isLoading: true });
    try {
      const url = `${constants.ALL_EMPLOYEES}?date=${date}${search ? `&search=${search}` : ''}`;
      const response = await apiRequest(url, 'GET');
      if (response.ok) {
        // const data = await response.json();
        set({ data: response.data, isLoading: false });
      } else {
        set({ isLoading: false });
        toast.error('Failed to fetch employees');
      }
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching employees:', error);
      toast.error('An error occurred while fetching employees');
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
