"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";
import type { User } from "@/lib/types";

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
      return fetchData("auth/registration/", "POST", {
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: (data: User) => {
      setContextUser(data);
      router.push("/");
    },
    onError: (error: Error | ApiError) => {
      console.warn("Mutation onError:", error);
      const apiError = error as ApiError;
      if (apiError.non_field_errors && apiError.non_field_errors.length > 0) {
        alert(apiError.non_field_errors[0]);
        setFieldErrors({});
      } else {
        const newFieldErrors: Partial<ApiError> = {};
        if (apiError.username && apiError.username.length > 0) {
          newFieldErrors.username = apiError.username;
        }
        if (apiError.email && apiError.email.length > 0) {
          newFieldErrors.email = apiError.email;
        }
        if (apiError.password1 && apiError.password1.length > 0) {
          newFieldErrors.password1 = apiError.password1;
        }
        if (apiError.password2 && apiError.password2.length > 0) {
          newFieldErrors.password2 = apiError.password2;
        }

        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
        } else if (apiError.detail && apiError.detail.length > 0) {
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFieldErrors({}); // Clear previous errors
    mutation.mutate(user);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof LoginInput,
  ) => {
    const { value } = event.currentTarget;
    setUser((previousUser) => ({ ...previousUser, [fieldName]: value }));
    // Clear error for this field when user starts typing
    if (fieldErrors[fieldName] && fieldErrors[fieldName]?.length) {
      setFieldErrors((previousErrors) => ({
        ...previousErrors,
        [fieldName]: undefined,
      }));
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
          onChange={(event) => {
            handleInputChange(event, "username");
          }}
          required={true}
          className="rounded-xl p-6 text-white"
        />
        {fieldErrors.username &&
          fieldErrors.username.length > 0 &&
          fieldErrors.username.map((errorText, index) => (
            <p key={`username-error-${index}`} className="text-sm text-red-500">
              {errorText}
            </p>
          ))}
        <Input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(event) => {
            handleInputChange(event, "email");
          }}
          required={true}
          className="rounded-xl p-6 text-white"
        />
        {fieldErrors.email &&
          fieldErrors.email.length > 0 &&
          fieldErrors.email.map((errorText, index) => (
            <p key={`email-error-${index}`} className="text-sm text-red-500">
              {errorText}
            </p>
          ))}
        <Input
          type="password"
          placeholder="Password"
          value={user.password1}
          onChange={(event) => {
            handleInputChange(event, "password1");
          }}
          className="rounded-xl p-6 text-white"
          required={true}
        />
        {fieldErrors.password1 &&
          fieldErrors.password1.length > 0 &&
          fieldErrors.password1.map((errorText, index) => (
            <p
              key={`password1-error-${index}`}
              className="text-sm text-red-500"
            >
              {errorText}
            </p>
          ))}
        <Input
          type="password"
          placeholder="Repeat Password"
          value={user.password2}
          onChange={(event) => {
            handleInputChange(event, "password2");
          }}
          className="rounded-xl p-6 text-white"
          required={true}
        />
        {fieldErrors.password2 &&
          fieldErrors.password2.length > 0 &&
          fieldErrors.password2.map((errorText, index) => (
            <p
              key={`password2-error-${index}`}
              className="text-sm text-red-500"
            >
              {errorText}
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
