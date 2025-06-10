"use client";

import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";
import { Movie } from "@/lib/types";

import { MovieTile } from "./movie";
import Spinner from "./ui/spinner";

export const MyReviews = () => {
  const { user } = useUser();

  const { data, isLoading, isError } = useQuery<Movie[]>({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      return await fetchData("movies/watched/", "GET", undefined, user?.access);
    },

    enabled: !!user,
  });

  if (isError) {
    return <p className="text-red-500">Error loading my reviews.</p>;
  }

  if (isLoading || !data) {
    return <Spinner />;
  }

  return (
    <div className="flex max-w-80 space-x-24 overflow-x-auto p-8 sm:max-w-96 lg:max-w-[550px]">
      {data.map((movie) => (
        <div key={movie.id} className="flex-shrink-0">
          <MovieTile movie={movie} />
        </div>
      ))}
    </div>
  );
};
