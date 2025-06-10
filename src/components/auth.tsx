"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import GoogleButton from "@/app/login/components/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";
import type { User } from "@/lib/types";

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
    mutationFn: async (credentials: LoginInput) => {
      return fetchData("auth/login/", "POST", {
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: (data: User) => {
      setContextUser(data);
      router.push("/");
    },
    onError: (error: any) => {
      alert(error.message || "Please try again.");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(user);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof Omit<typeof user, "id" | "username">,
  ) => {
    const inputValue = event.currentTarget.value;
    setUser((previousUser) => ({ ...previousUser, [fieldName]: inputValue }));
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
          onChange={(event) => handleInputChange(event, "email")}
          className="rounded-xl p-6 text-white"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(event) => handleInputChange(event, "password")}
          className="rounded-xl p-6 text-white"
          required
        />
        <GoogleButton />
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
