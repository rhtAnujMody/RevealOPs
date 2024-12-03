import { create } from "zustand";
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";

interface Compliance {
  id: number;
  compliance: string;
  compliance_percentage: string;
  created_at: string;
  updated_at: string;
}

interface ComplianceStore {
  isLoading: boolean;
  data: Compliance[];
  headers: { key: string; value: string }[];
  getAllCompliances: () => Promise<void>;
}

const useComplianceStore = create<ComplianceStore>((set) => ({
  isLoading: false,
  data: [],
  headers: [
    { key: "id", value: "ID" },
    { key: "compliance", value: "Compliance" },
    { key: "compliance_percentage", value: "Compliance Percentage" },
  ],
  getAllCompliances: async () => {
    try {
      set({ isLoading: true });
      const response = await apiRequest<Compliance[]>(constants.COMPLIANCE, "GET");
      set({ data: response.data });
    } catch (error) {
      console.error("Error fetching compliances:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useComplianceStore; 