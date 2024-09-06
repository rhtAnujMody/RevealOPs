import constants from "@/lib/constants";
import { TFetchError, TFetchResponse } from "@/lib/model";

export async function apiRequest<TResponse, TBody = undefined>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: TBody,
  headers: Record<string, string> = { "Content-Type": "application/json" }
): Promise<TFetchResponse<TResponse>> {
  try {
    const response = await fetch(`${constants.API_URL}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

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
