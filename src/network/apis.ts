import constants from "@/lib/constants";
import { clearLocalStorage } from "@/lib/utils";
import useNavigationStore from "@/stores/useNavigationStore";

interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: any;
}

export const apiRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  isFormData: boolean = false
): Promise<ApiResponse<T>> => {
  try {
    const token = localStorage.getItem(constants.TOKEN);
    const headers: HeadersInit = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body) {
      if (isFormData) {
        requestOptions.body = body;
      } else {
        requestOptions.body = JSON.stringify(body);
      }
    }

    const response = await fetch(`${constants.API_URL}${endpoint}`, requestOptions);
    const data = await response.json();

    return {
      ok: response.ok,
      data: response.ok ? data : undefined,
      error: !response.ok ? data : undefined,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      ok: false,
      error: 'Network error occurred',
    };
  }
};
