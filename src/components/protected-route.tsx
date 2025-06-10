"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useUser } from "@/context/user-context";

import Spinner from "./ui/spinner";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute(props: Props) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return props.children;
}
