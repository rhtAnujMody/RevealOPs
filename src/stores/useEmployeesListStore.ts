import { create } from "zustand";
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";

export type TEmployeeListFilters = {
  search?: string;
  business_unit?: string;
  designation?: string;
  team?: string;
  status?: string;
  availability?: string;
  date?: string;
  page?: number;
};

export type TEmployeeListItem = {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  business_unit: string;
  designation: string;
  status: string;
  allocation_status: string;
  bandwidth_available: number;
  team: string;
};

type TEmployeesListStore = {
  isLoading: boolean;
  data: TEmployeeListItem[];
  totalPages: number;
  currentPage: number;
  filters: TEmployeeListFilters;
  headers: Array<{ key: string; value: string }>;
  setLoading: (loading: boolean) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: Partial<TEmployeeListFilters>) => void;
  getAllEmployees: () => Promise<void>;
  clearFilters: () => void;
};

const useEmployeesListStore = create<TEmployeesListStore>((set, get) => ({
  isLoading: false,
  data: [],
  totalPages: 1,
  currentPage: 1,
  filters: {},
  headers: [
    { key: "employee_id", value: "Employee ID" },
    { key: "first_name", value: "First Name" },
    { key: "last_name", value: "Last Name" },
    { key: "business_unit", value: "Business Unit" },
    { key: "designation", value: "Designation" },
    { key: "team", value: "Team" },
    { key: "status", value: "Status" },
    { key: "allocation_status", value: "Allocation Status" },
    { key: "bandwidth_available", value: "Available Bandwidth (%)" },
  ],
  setLoading: (loading) => set({ isLoading: loading }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    })),
  clearFilters: () => set({ filters: {}, currentPage: 1 }),
  getAllEmployees: async () => {
    const { filters, currentPage } = get();
    set({ isLoading: true });
    try {
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string | number>);

      const queryParams = new URLSearchParams({
        ...cleanFilters,
        page: currentPage.toString(),
      });
      
      console.log('Fetching employees with URL:', `${constants.ALL_ALLOCATIONS}?${queryParams.toString()}`);
      
      const response = await apiRequest<TEmployeeListItem[]>(
        `${constants.ALL_ALLOCATIONS}?${queryParams.toString()}`,
        "GET"
      );

      console.log('API Response:', response);

      if (response.ok && response.data) {
        const totalPages = parseInt(response.headers?.['total-pages'] || '1');
        const currentPageFromHeader = parseInt(response.headers?.['current-page'] || '1');
        
        console.log('Pagination info:', { totalPages, currentPage: currentPageFromHeader });

        set({
          data: response.data,
          totalPages: totalPages,
          currentPage: currentPageFromHeader,
          isLoading: false,
        });
      } else {
        console.log('Response not OK or no data');
        set({ data: [], totalPages: 1, isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      set({ data: [], totalPages: 1, isLoading: false });
    }
  },
}));

export default useEmployeesListStore; 