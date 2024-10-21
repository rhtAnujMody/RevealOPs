import { TNavigationFunction, TNavigationStore } from "@/lib/model";
import { create } from "zustand";

const useNavigationStore = create<TNavigationStore>((set, get) => ({
  navigationFunction: null,
  setNavigationFunction: (navFunction: TNavigationFunction) =>
    set({ navigationFunction: navFunction }),
  navigate: (route: string, replace: boolean = false) => {
    // Check if a navigation function is available
    const navigationFunction = get().navigationFunction;
    if (navigationFunction) {
      // Call the navigation function with the route
      navigationFunction(route, { replace });
    } else {
      console.error("Navigation function not set.");
    }
  },
}));

export default useNavigationStore;
