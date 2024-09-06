import constants from "@/lib/constants";
import { TLogin, TLoginStore } from "@/lib/model";
import { checkIsEmpty, setLocalStorage, validateEmail } from "@/lib/utils";
import { apiRequest } from "@/network/apis";
import { create } from "zustand";
import useGlobalStore from "./useGlobalStore";

const useLoginStore = create<TLoginStore>((set, get) => ({
  isLoading: false,
  email: "",
  password: "",
  emailError: "",
  passwordError: "",
  serverError: "",
  setEmail: (email: React.ChangeEvent<HTMLInputElement>) => {
    set({ email: email.target.value, emailError: "", serverError: "" });
  },
  setPassword: (password: React.ChangeEvent<HTMLInputElement>) => {
    set({
      password: password.target.value,
      passwordError: "",
      serverError: "",
    });
  },
  setLoading: (isLoading) => set({ isLoading: isLoading }),
  setEmailError: (emailError) => set({ emailError: emailError }),
  setPasswordError: (passwordError) => set({ passwordError: passwordError }),
  setServerError: (serverError) => set({ serverError: serverError }),
  onSubmit: async () => {
    if (checkIsEmpty(get().email) || checkIsEmpty(get().password)) {
      set({
        emailError: "Email is required",
        passwordError: "Password is required",
      });
      return;
    }

    if (!validateEmail(get().email)) {
      set({ emailError: "Invalid Email" });
      return;
    }
    if (get().password.length < 6) {
      set({ passwordError: "Password should be at least 6 characters long" });
      return;
    }
    set({ isLoading: true, serverError: "" });
    const response = await apiRequest<TLogin, Record<string, string>>(
      "api/login/",
      "POST",
      {
        email: get().email,
        password: get().password,
      }
    );
    if (response.ok) {
      setLocalStorage(constants.IS_AUTHENTICATED, "true");
      setLocalStorage(constants.TOKEN, response.data?.access ?? "");
      setLocalStorage(constants.REFRESH, response.data?.refresh ?? "");
      useGlobalStore.getState().setIsAuthenticated(true);
      // useNavigationStore.getState().navigate("/dashboard");
    } else {
      console.log("error", response.error?.error);
      set({ serverError: response.error?.error });
    }
    set({ isLoading: false });
  },
}));

export default useLoginStore;
