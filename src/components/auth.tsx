"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";
import { User } from "@/lib/types";

interface LoginInput {
  email: string;
  password: string;
}

export function Auth() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { setUser: setContextUser } = useUser();
  const router = useRouter();

  const mutation = useMutation<User, Error, LoginInput>({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await fetchData("auth/login/", "POST", {
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: (data: User) => {
      setContextUser(data);
      router.push("/");
    },
    onError: (error: any) => {
      alert(error.message || "Something went wrong");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(user);
  };

  return (
    <div className="bg-gradient-primary flex h-screen w-full items-center justify-center px-10">
      <form
        onSubmit={handleSubmit}
        className="flex w-96 flex-col items-center space-y-8 rounded-3xl bg-neutral-600/30 p-10 backdrop-blur-[48.70px]"
      >
        <p className="pb-8 text-4xl text-white sm:text-5xl">Login</p>
        <Input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => {
            const val = e.currentTarget.value;
            setUser((prev) => ({ ...prev, email: val }));
          }}
          required={true}
          className="rounded-xl p-6 text-white"
        />
        <Input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => {
            const val = e.currentTarget.value;
            setUser((prev) => ({ ...prev, password: val }));
          }}
          className="rounded-xl p-6 text-white"
          required={true}
        />
        <Button
          onSubmit={handleSubmit}
          type="submit"
          className="cursor-pointer border-none bg-white p-6 text-xl text-black hover:bg-gray-300"
        >
          Sign In
        </Button>
        <Link
          href={"/sign-in"}
          className="text-white hover:bg-none hover:underline"
        >
          Sign up
        </Link>
      </form>
    </div>
  );
}
