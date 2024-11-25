import constants from "@/lib/constants";
import { TProjects, TProjectStore } from "@/lib/model";
import { formatDataToHeaders } from "@/lib/utils";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProjectStore = create<TProjectStore>()(
  persist(
    (set, get) => ({
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading: isLoading }),
      headers: [
        { key: "id", value: "ID" },
        { key: "project_name", value: "Project Name" },
        { key: "customer_name", value: "Customer Name" },
        { key: "project_type", value: "Project Type" },
        { key: "service_offering", value: "Service Offering" },
        { key: "project_status", value: "Project Status" },
      ],
      data: [],
      search: "",
      currentPage: 1,
      totalPages: 1,
      setSearch: (search) => set({ search: search }),
      clearSearch: () => set({ search: "", currentPage: 1 }),
      setCurrentPage: (page: number) => set({ currentPage: page }),
      setTotalPages: (pages: number) => set({ totalPages: pages }),
      projectStatus: 'all',
      setProjectStatus: (status) => set({ projectStatus: status }),
      getAllProjects: async (page: number = 1) => {
        set({ isLoading: true });
        const searchParams = new URLSearchParams();
        if (get().search) searchParams.set('search', get().search);
        if (get().projectStatus !== 'all') searchParams.set('project_status', get().projectStatus);
        searchParams.set('page', page.toString());
        
        const response = await apiRequest<TProjects[]>(
          `${constants.ALL_PROJECTS}?${searchParams.toString()}`
        );
        if (response.ok) {
          const totalPages = parseInt(response.headers['total-pages'] || '1');
          set({
            isLoading: false,
            data: formatDataToHeaders(response.data!, get().headers),
            currentPage: page,
            totalPages: totalPages || 1,
          });
        }
      },
    }),
    {
      name: "project-store",
      partialize: (state) => ({ search: state.search }),
    }
  )
);

export default useProjectStore;
