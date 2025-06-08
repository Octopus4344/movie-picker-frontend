"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { fetchData } from "@/lib/api";
import type { User } from "@/lib/types";

interface UserContextInterface {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextInterface | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within the context");
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser !== null && storedUser !== undefined && storedUser !== "") {
      try {
        setUser(JSON.parse(storedUser) as User | null);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user !== null && user !== undefined) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const logoutMutation = useMutation({
    mutationFn: async () => fetchData("user/logout", "DELETE"),
    onSuccess: () => {
      clearUser();
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Error logging out:", error);
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: setUser as Dispatch<SetStateAction<User | null>>,
        clearUser,
        logout,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
