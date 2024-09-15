import constants from "@/lib/constants";
import { TFetchError, TFetchResponse } from "@/lib/model";
import { clearLocalStorage, getLocalStorage } from "@/lib/utils";
import useNavigationStore from "@/stores/useNavigationStore";

export async function apiRequest<TResponse, TBody = undefined>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: TBody,
  headers: Record<string, string> = { "Content-Type": "application/json" }
): Promise<TFetchResponse<TResponse>> {
  try {
    const token = getLocalStorage(constants.TOKEN);

    // Construct authorization headers if token is present
    const authHeaders: HeadersInit = {};
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${constants.API_URL}${url}`, {
      method,
      headers: {
        ...authHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      clearLocalStorage();
      useNavigationStore.getState().navigate("/", true);
    }

    const responseBody = response.ok ? await response.json() : undefined;

    return {
      data: responseBody as TResponse,
      status: response.status,
      ok: response.ok,
      error: !response.ok ? await response.json() : undefined,
    };
  } catch (error: unknown) {
    console.log("error", error);

    const fetchError = error as TFetchError;
    return {
      status: fetchError.status || 500,
      ok: false,
      error: fetchError.message || { error: "An unknown error occurred" },
    };
  }
}

// const fetch = window.fetch;
// window.fetch = (...args) =>
//   (async (args) => {
//     const result = await fetch(...args);
//     console.log("response", result); // intercept response here
//     if (result.status === 401) {
//       clearLocalStorage();
//       useNavigationStore.getState().navigate("/", true);
//     }
//     return result;
//   })(args);
