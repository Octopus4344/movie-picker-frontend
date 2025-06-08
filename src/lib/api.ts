import { NEXT_PUBLIC_API_URL } from "@/config/api";

export async function fetchData(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" | "GET" = "POST",
  options?: RequestInit,
  apiURL?: string,
  token?: string | null,
) {
  const url = apiURL || NEXT_PUBLIC_API_URL;
  const response = await fetch(`${url}/${endpoint}`, {
    method: method,
    ...options,
    headers: {
      "Content-Type": "application/json",
    },
    ...(token && { Authorization: `Bearer ${token}` }),
  });
  const contentType = response.headers.get("Content-Type") || "";

  if (!response.ok) {
    let errorDataToThrow: any;

    if (contentType.includes("application/json")) {
      errorDataToThrow = await response.json();
    } else {
      const textError = await response.text();
      errorDataToThrow = { detail: textError, message: textError };
      console.log("API Error (Non-JSON):", errorDataToThrow);
    }
    // Throw the parsed JSON object or the constructed error object directly
    throw errorDataToThrow;
  }

  if (contentType.includes("application/json")) {
    return await response.json();
  } else if (response.statusText === "204") return null;
  else if (contentType.includes("text/")) {
    return await response.text();
  } else return response.blob();
}
