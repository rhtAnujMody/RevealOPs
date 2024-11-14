import constants from "@/lib/constants";
import { clearLocalStorage } from "@/lib/utils";
import useNavigationStore from "@/stores/useNavigationStore";

export const apiRequest = async <T>(
  endpoint: string,
  method: string,
  body?: any
): Promise<{ ok: boolean; data?: T; error?: any; headers?: Record<string, string> }> => {
  try {
    const token = localStorage.getItem(constants.TOKEN);
    const authHeaders: HeadersInit = {};
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${constants.API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    // Get pagination headers
    const headers: Record<string, string> = {};
    headers['total-pages'] = response.headers.get('total-pages') || '1';
    headers['current-page'] = response.headers.get('current-page') || '1';

    console.log('API Response:', { 
      endpoint, 
      status: response.status, 
      data,
      headers: headers
    });

    return {
      ok: response.ok,
      data: response.ok ? data : undefined,
      error: !response.ok ? data : undefined,
      headers: headers
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return { ok: false, error };
  }
};
