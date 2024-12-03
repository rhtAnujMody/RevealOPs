import { create } from "zustand";
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";

export interface RecruitmentRequest {
  id: number;
  created_at: string;
  updated_at: string;
  request_date: string;
  screened: boolean;
  round1_select: boolean;
  round2_select: boolean;
  round3_select: boolean;
  offer_status: "Pending" | "Offered" | "Rejected";
  joining_date: string | null;
}

interface RecruitmentStore {
  isLoading: boolean;
  data: RecruitmentRequest[];
  headers: { key: string; value: string }[];
  search: string;
  currentPage: number;
  totalPages: number;
  offerStatus: string;
  setSearch: (search: string) => void;
  clearSearch: () => void;
  setCurrentPage: (page: number) => void;
  setOfferStatus: (status: string) => void;
  getAllRecruitments: (page: number, search?: string, status?: string) => Promise<void>;
}

const useRecruitmentStore = create<RecruitmentStore>((set, get) => ({
  isLoading: false,
  data: [],
  headers: [
    { key: "id", value: "ID" },
    { key: "request_date", value: "Request Date" },
    { key: "screened", value: "Screened" },
    { key: "round1_select", value: "Round 1" },
    { key: "round2_select", value: "Round 2" },
    { key: "round3_select", value: "Round 3" },
    { key: "offer_status", value: "Offer Status" },
    { key: "joining_date", value: "Joining Date" },
  ],
  search: "",
  currentPage: 1,
  totalPages: 1,
  offerStatus: "",

  setSearch: (search) => set({ search }),
  clearSearch: () => set({ search: "" }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setOfferStatus: (status) => set({ offerStatus: status }),

  getAllRecruitments: async (page, search = "", status = "") => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
        ...(status && { offer_status: status }),
      });

      const response = await apiRequest<RecruitmentRequest[]>(
        `${constants.RECRUITMENT_REQUESTS}?${queryParams}`,
        "GET"
      );

      if (response.ok && response.data) {
        set({
          data: response.data,
          totalPages: Math.ceil(response.data.length / 10), // Adjust based on your pagination implementation
        });
      }
    } catch (error) {
      console.error("Error fetching recruitment requests:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useRecruitmentStore; 