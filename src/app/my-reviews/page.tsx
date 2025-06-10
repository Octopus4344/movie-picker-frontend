"use client";

import { useQuery } from "@tanstack/react-query";

import { MovieTile } from "@/components/movie";
import { ProtectedRoute } from "@/components/protected-route";
import Spinner from "@/components/ui/spinner";
import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";
import { Movie } from "@/lib/types";

export default function MyReviewsPage() {
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
    <ProtectedRoute>
      <div className="bg-gradient-primary flex min-h-screen flex-col items-start overflow-hidden px-10 md:p-24">
        <h1 className="mb-8 pt-24 text-3xl font-light text-white">
          Your reviews
        </h1>
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((movie) => (
            <div key={movie.id} className="flex-shrink-0">
              <MovieTile movie={movie.film} review={movie.review} />
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
