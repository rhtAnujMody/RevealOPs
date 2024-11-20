import constants from "@/lib/constants";
import { clearLocalStorage } from "@/lib/utils";
import useNavigationStore from "@/stores/useNavigationStore";

interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: any;
  headers?: Record<string, string>;
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

    // Get pagination headers
    const responseHeaders: Record<string, string> = {};
    responseHeaders['total-pages'] = response.headers.get('total-pages') || '1';
    responseHeaders['current-page'] = response.headers.get('current-page') || '1';

    return {
      ok: response.ok,
      data: response.ok ? data : undefined,
      error: !response.ok ? data : undefined,
      headers: responseHeaders
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      ok: false,
      error: 'Network error occurred',
    };
  }
};
