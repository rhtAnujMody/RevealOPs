import useGlobalStore from "@/stores/useGlobalStore";
import useNavigationStore from "@/stores/useNavigationStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkIsEmpty = (value: string) => {
  if (value && value.length > 0) {
    return false;
  }
  return true;
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const clearLocalStorage = () => {
  return localStorage.clear();
};

export const formatDataToHeaders = <T extends object>(
  data: T[],
  headers: Record<string, string>[]
): T[] => {
  return data.map((item) => {
    const filteredItem = {} as T;

    headers.forEach(({ key }) => {
      if (key in item) {
        filteredItem[key as keyof T] = item[key as keyof T];
      }
    });

    return { ...filteredItem, actions: "actions" };
  });
};

export const logoutUser = () => {
  clearLocalStorage();
  useGlobalStore.getState().setIsAuthenticated(false);
  useNavigationStore.getState().navigate(`/`, false);
};
