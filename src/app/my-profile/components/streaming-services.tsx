"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { use, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { useUser } from "@/context/user-context";
// Import custom Checkbox
import { fetchData } from "@/lib/api";
import { StreamingService } from "@/lib/types";

interface StreamingServicesProps {
  selectedServices: number[];
  setSelectedServices: (ids: number[]) => void;
}

export const StreamingServices = ({
  selectedServices,
  setSelectedServices,
}: StreamingServicesProps) => {
  const [filterText, setFilterText] = useState("");
  const { user } = useUser();

  const { data, isLoading, isError } = useQuery<StreamingService[]>({
    queryKey: ["streaming-services"],
    queryFn: async () => {
      return await fetchData("movies/streaming-services/", "GET");
    },
    enabled: !!user,
  });

  if (isError) {
    return <p className="text-red-500">Error loading streaming services.</p>;
  }

  if (isLoading || !data) {
    return <Spinner />;
  }

  const filteredServices = data.filter((service) =>
    service.name.toLowerCase().includes(filterText.toLowerCase()),
  );

  const handleCheckboxChange = (serviceId: number) => {
    setSelectedServices(
      selectedServices.includes(serviceId)
        ? selectedServices.filter((id) => id !== serviceId)
        : [...selectedServices, serviceId],
    );
  };

  return (
    <div className="flex flex-col space-y-8">
      <p className="text-xl sm:text-2xl">Streaming Services</p>
      <Input
        type="text"
        placeholder="Filter by name..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="max-w-sm"
      />
      {filteredServices.length === 0 && (
        <p>No services found matching your filter.</p>
      )}
      <div className="grid max-h-60 grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-4 lg:grid-cols-5">
        {filteredServices.map((service) => (
          <label
            key={service.id}
            className="flex cursor-pointer flex-col items-center space-y-2 rounded-lg border p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Image
              src={service.logo_path}
              alt={service.name}
              width={60}
              height={60}
              className="rounded-md object-contain"
            />
            <Checkbox // Use custom Checkbox component
              checked={selectedServices.includes(service.id)}
              onCheckedChange={() => handleCheckboxChange(service.id)}
              id={`service-${service.id}`} // Add id for accessibility with label
            />
          </label>
        ))}
      </div>
    </div>
  );
};
