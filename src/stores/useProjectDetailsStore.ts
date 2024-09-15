import constants from "@/lib/constants";
import { TProjectDetailsStore, TProjects } from "@/lib/model";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";

const useProjectDetailsStore = create<TProjectDetailsStore>((set, get) => ({
  isLoading: false,
  id: "",
  setId: (id) => set({ id: id }),
  setLoading: (isLoading) => set({ isLoading: isLoading }),
  data: {} as TProjects,
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
}));

export default useProjectDetailsStore;
