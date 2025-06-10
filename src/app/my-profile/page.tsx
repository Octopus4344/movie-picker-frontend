"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";

import { StreamingServices } from "./components/streaming-services";

export default function MyProfilePage() {
  const { user } = useUser();
  const [streamingList, setStreamingList] = useState<number[]>([]);

  const mutation = useMutation<number[], Error, number[]>({
    mutationFn: async (streaming_service_ids: number[]) => {
      return fetchData(
        "auth/streaming-services/",
        "PUT",
        {
          body: JSON.stringify({
            streaming_service_ids: streaming_service_ids,
          }),
        },
        user?.access,
      );
    },
    onSuccess: () => {
      alert("Streaming services updated successfully.");
      setStreamingList([]);
    },
    onError: (error: any) => {
      alert(error.message || "Please try again.");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitting streaming services:", streamingList);
    mutation.mutate(streamingList);
  };

  return (
    <ProtectedRoute>
      <div className="bg-gradient-primary flex min-h-screen flex-col items-start justify-start space-y-8 overflow-hidden px-8 text-white sm:pl-24">
        <p className="pt-36 text-2xl sm:pt-48 sm:text-3xl">Your Profile</p>
        <div className="flex flex-col space-y-8 rounded-3xl bg-neutral-600/30 p-10 backdrop-blur-[48.70px] sm:flex-row sm:space-x-24">
          <div className="flex flex-col space-y-8">
            <p className="text-xl sm:text-2xl">Personal data</p>

            <TextField text={user?.user.email} />
            <TextField text={user?.user.first_name} />
            <TextField text={user?.user.last_name} />
          </div>
          <div className="flex flex-col space-y-8">
            <p className="text-xl sm:text-2xl">My subscriptions</p>
            <StreamingServices
              selectedServices={streamingList}
              setSelectedServices={setStreamingList}
            />
          </div>
        </div>
        <div className="flex w-full flex-row items-center justify-center">
          <Button
            onClick={handleSubmit}
            className="cursor-pointer bg-white p-4 text-xl font-light text-black hover:bg-gray-200"
          >
            Save
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

const TextField = ({ text }: { text?: string }) => {
  return (
    <Input
      type="text"
      value={text}
      className="rounded-xl p-6 text-white"
      disabled
    />
  );
};
