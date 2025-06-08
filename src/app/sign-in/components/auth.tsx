"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";
import { User } from "@/lib/types";

interface LoginInput {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

interface ApiError {
  non_field_errors?: string[];
  username?: string[];
  email?: string[];
  password1?: string[];
  password2?: string[];
  detail?: string;
}

export function Auth() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<ApiError>>({});
  const { setUser: setContextUser } = useUser();
  const router = useRouter();

  const mutation = useMutation<User, Error, LoginInput>({
    mutationFn: async (credentials: {
      username: string;
      email: string;
      password1: string;
      password2: string;
    }) => {
      return await fetchData("auth/registration/", "POST", {
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: (data: User) => {
      setContextUser(data);
      router.push("/");
    },
    onError: (error: any) => {
      console.log(error);
      const apiError = error as ApiError;
      if (apiError.non_field_errors && apiError.non_field_errors.length > 0) {
        alert(apiError.non_field_errors[0]);
        setFieldErrors({});
      } else {
        const newFieldErrors: Partial<ApiError> = {};
        if (apiError.username) newFieldErrors.username = apiError.username;
        if (apiError.email) newFieldErrors.email = apiError.email;
        if (apiError.password1) newFieldErrors.password1 = apiError.password1;
        if (apiError.password2) newFieldErrors.password2 = apiError.password2;

        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
        } else if (apiError.detail) {
          alert(apiError.detail);
          setFieldErrors({});
        } else {
          alert(
            "Something went wrong. Please check the details and try again.",
          );
          setFieldErrors({});
        }
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({}); // Clear previous errors
    mutation.mutate(user);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof LoginInput,
  ) => {
    const { value } = e.currentTarget;
    setUser((prev) => ({ ...prev, [fieldName]: value }));
    // Clear error for this field when user starts typing
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  return (
    <div className="bg-gradient-primary flex h-screen w-full items-center justify-center px-10">
      <form
        onSubmit={handleSubmit}
        className="flex w-96 flex-col items-center space-y-8 rounded-3xl bg-neutral-600/30 p-10 backdrop-blur-[48.70px]"
      >
        <p className="pb-8 text-4xl text-white sm:text-5xl">Sign up</p>
        <Input
          type="text"
          placeholder="Username"
          value={user.username}
          onChange={(e) => {
            handleInputChange(e, "username");
          }}
          required={true}
          className="rounded-xl p-6 text-white"
        />
        {fieldErrors.username &&
          fieldErrors.username.map((err, index) => (
            <p key={index} className="text-sm text-red-500">
              {err}
            </p>
          ))}
        <Input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => {
            handleInputChange(e, "email");
          }}
          required={true}
          className="rounded-xl p-6 text-white"
        />
        {fieldErrors.email &&
          fieldErrors.email.map((err, index) => (
            <p key={index} className="text-sm text-red-500">
              {err}
            </p>
          ))}
        <Input
          type="password"
          placeholder="Password"
          value={user.password1}
          onChange={(e) => {
            handleInputChange(e, "password1");
          }}
          className="rounded-xl p-6 text-white"
          required={true}
        />
        {fieldErrors.password1 &&
          fieldErrors.password1.map((err, index) => (
            <p key={index} className="text-sm text-red-500">
              {err}
            </p>
          ))}
        <Input
          type="password"
          placeholder="Repeat Password"
          value={user.password2}
          onChange={(e) => {
            handleInputChange(e, "password2");
          }}
          className="rounded-xl p-6 text-white"
          required={true}
        />
        {fieldErrors.password2 &&
          fieldErrors.password2.map((err, index) => (
            <p key={index} className="text-sm text-red-500">
              {err}
            </p>
          ))}
        <Button
          onSubmit={handleSubmit}
          type="submit"
          className="cursor-pointer border-none bg-white p-6 text-xl text-black hover:bg-gray-300"
        >
          Sign Up
        </Button>
        <Link
          href={"/login"}
          className="text-white hover:bg-none hover:underline"
        >
          Log in
        </Link>
      </form>
    </div>
  );
}
