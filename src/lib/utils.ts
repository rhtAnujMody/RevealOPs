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

export function formatDataToHeaders<T>(
  data: T[],
  headers: { key: string; value: string }[]
): Record<string, string>[] {
  return data.map((item) => {
    const formattedItem: Record<string, string> = {};
    headers.forEach((header) => {
      formattedItem[header.key] = String((item as any)[header.key] ?? "");
    });
    return formattedItem;
  });
}

export const logoutUser = () => {
  clearLocalStorage();
  useGlobalStore.getState().setIsAuthenticated(false);
  useNavigationStore.getState().navigate(`/`, false);
};

export const convertDaysToWeeks = (days: number): string => {
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  if (weeks === 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else if (remainingDays === 0) {
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else {
    return `${weeks} week${weeks !== 1 ? 's' : ''} and ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
  }
};
