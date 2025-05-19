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
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
        return;
      }
    }
  }, [user, isLoading]);

  //suspensea tez mozna zrobic ladniejszego
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{props.children}</>;
}
