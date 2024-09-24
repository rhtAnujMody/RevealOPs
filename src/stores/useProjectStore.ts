import constants from "@/lib/constants";
import { TProjects, TProjectStore } from "@/lib/model";
import { formatDataToHeaders } from "@/lib/utils";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";

const useProjectStore = create<TProjectStore>((set, get) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading: isLoading }),
  headers: [
    { key: "id", value: "ID" },
    { key: "project_name", value: "Project Name" },
    { key: "customer_name", value: "Customer Name" },
    { key: "project_type", value: "Project Type" },
    { key: "service_offering", value: "Service Offering" },
    { key: "project_status", value: "Project Status" },
    { key: "actions", value: "Actions" },
  ],
  data: [],
  search: "",
  setSearch: (search) => set({ search: search }),
  getAllProjects: async () => {
    set({ isLoading: true });
    const response = await apiRequest<TProjects[]>(
      get().search
        ? `${constants.ALL_PROJECTS}?search=${get().search}`
        : constants.ALL_PROJECTS,
      "GET"
    );
    if (response.ok) {
      set({
        isLoading: false,
        data: formatDataToHeaders(response.data!, get().headers),
      });
    }
  },
}));

export default useProjectStore;
