import { NEXT_PUBLIC_API_URL } from "@/config/api";

export async function fetchData(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" | "GET" = "POST",
  options?: RequestInit,
  token?: string | null,
  apiURL?: string,
) {
  const url = apiURL ?? NEXT_PUBLIC_API_URL;
  const response = await fetch(`${url}/${endpoint}`, {
    method,
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  const contentType = response.headers.get("Content-Type") ?? "";

  if (!response.ok) {
    let errorDataToThrow: any;

    if (contentType.includes("application/json")) {
      errorDataToThrow = await response.json();
    } else {
      const textError = await response.text();
      errorDataToThrow = { detail: textError, message: textError };
      console.warn("API Error (Non-JSON):", errorDataToThrow);
    }
    throw errorDataToThrow;
  }

  if (contentType.includes("application/json")) {
    return response.json();
  } else if (response.status === 204) {
    return null;
  } else if (contentType.includes("text/")) {
    return response.text();
  } else {
    return response.blob();
  }
}
