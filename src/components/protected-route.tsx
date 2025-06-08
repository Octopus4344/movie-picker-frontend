"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useUser } from "@/context/user-context";

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
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return props.children;
}
