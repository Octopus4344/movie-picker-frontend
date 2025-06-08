"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";
// Your existing API helper
import type { User } from "@/lib/types";

// This component will be rendered by the route /google/callback
export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser: setContextUser } = useUser();

  const mutation = useMutation<User, Error, { code: string }>({
    mutationFn: async (payload: { code: string }) => {
      // This matches the tutorial's fetch call to your Django backend
      return fetchData("auth/google/", "POST", {
        // Your backend endpoint for Google auth
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data: User) => {
      setContextUser(data); // Update user context
      router.push("/"); // Redirect to home or dashboard after successful login
    },
    onError: (error: Error) => {
      console.error("Google sign-in error (backend exchange):", error);
      // Redirect to login page with an error message, or display inline
      alert(
        error.message || "Failed to sign in with Google. Please try again.",
      );
      router.push("/login");
    },
  });

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      mutation.mutate({ code });
    } else {
      // Handle cases where code is missing (e.g., user denied access, or error in redirect)
      console.error(
        "Google callback error: No authorization code found in URL.",
      );
      alert("Google sign-in was cancelled or failed. Please try again.");
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]); // Dependencies for useEffect

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p className="text-lg text-gray-700">Processing your Google sign-in...</p>
      {/* Optional: Add a spinner or more sophisticated loading UI */}
      {mutation.isError && (
        <p className="mt-4 text-red-500">
          Error: {mutation.error?.message || "An unknown error occurred."}
        </p>
      )}
    </div>
  );
}
