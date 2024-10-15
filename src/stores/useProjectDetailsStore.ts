import constants from "@/lib/constants";
import {
  TProjectDetailsStore,
  TProjects,
  TResourceAllocation,
} from "@/lib/model";
import { formatDataToHeaders } from "@/lib/utils";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";

const useProjectDetailsStore = create<TProjectDetailsStore>((set, get) => ({
  isLoading: false,
  resourceAllocationLoading: false,
  setResourceAllocationLoading: (resourceAllocationLoading) =>
    set({ resourceAllocationLoading: resourceAllocationLoading }),
  id: "",
  resourceAllocationHeaders: [
    { key: "id", value: "ID" },
    { key: "employee_name", value: "Name" },
    { key: "role", value: "Role" },
    { key: "bandwidth_allocated", value: "Bandwidth Allocated" },
    { key: "billable", value: "Billable" },
    { key: "allocation_start_date", value: "Start Date" },
    { key: "allocation_end_date", value: "End Date" },
  ],
  setId: (id) => set({ id: id }),
  setLoading: (isLoading) => set({ isLoading: isLoading }),
  data: {} as TProjects,
  resources: [] as TResourceAllocation[],
  getProjectDetails: async () => {
    set({ isLoading: true });
    const response = await apiRequest<TProjects>(
      `${constants.ALL_PROJECTS}${get().id}`,
      "GET"
    );
    if (response.ok) {
      set({
        isLoading: false,
        data: response.data,
      });
    }
  },
  getProjectAllocationDetails: async () => {
    set({ resourceAllocationLoading: true });
    const response = await apiRequest<TResourceAllocation[]>(
      `${constants.ALL_PROJECTS}${get().id}/allocations`,
      "GET"
    );
    if (response.ok) {
      set({
        resourceAllocationLoading: false,
        resources: formatDataToHeaders(
          response.data ?? [],
          // @ts-ignore
          get().resourceAllocationHeaders
        ),
      });
    }
  },
}));

export default useProjectDetailsStore;
