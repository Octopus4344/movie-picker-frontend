"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import Spinner from "@/components/ui/spinner";
import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";
import type { User } from "@/lib/types";

function GoogleCallbackComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser: setContextUser } = useUser();

  const mutation = useMutation<User, Error, { code: string }>({
    mutationFn: async (payload: { code: string }) => {
      return fetchData("auth/google/", "POST", {
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data: User) => {
      setContextUser(data);
      router.push("/");
    },
    onError: (error: Error) => {
      console.error("Google sign-in error (backend exchange):", error);
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
      console.error(
        "Google callback error: No authorization code found in URL.",
      );
      alert("Google sign-in was cancelled or failed. Please try again.");
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Spinner />
      <p className="mt-4 text-lg text-gray-700">
        Processing your Google sign-in...
      </p>
      {mutation.isError && (
        <p className="mt-4 text-red-500">
          Error: {mutation.error?.message || "An unknown error occurred."}
        </p>
      )}
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center">
          <Spinner />
        </div>
      }
    >
      {" "}
      {/* Use Spinner in fallback */}
      <GoogleCallbackComponent />
    </Suspense>
  );
}
