"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Rating } from "react-simple-star-rating";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";

export function ReviewDialog({ movieId }: { movieId: number }) {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [rating, setRating] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRatingChange = (rate: number) => {
    setRating(rate);
  };

  const mutation = useMutation({
    mutationFn: async (reviewData: { film: number; review: number }) => {
      return await fetchData(
        "movies/watched/",
        "POST",
        { body: JSON.stringify(reviewData) },
        user?.access,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      setRating(0);
      setIsDialogOpen(false);
      alert("Review submitted successfully!");
    },
    onError: (error: Error) => {
      alert(error.message || "Please try again.");
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }
    mutation.mutate({ film: movieId, review: rating });
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="my-1.5 bg-transparent">
          Rate this movie
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-neutral-600/30 p-10 backdrop-blur-[48.70px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Rate this movie
          </AlertDialogTitle>
          <AlertDialogDescription className="flex justify-center py-4">
            <Rating
              onClick={handleRatingChange}
              initialValue={rating}
              SVGstyle={{ display: "inline-block" }}
              size={30}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer border-none bg-white outline-0"
            onClick={() => {
              setRating(0);
              setIsDialogOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer bg-white text-black hover:bg-gray-100"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Submitting..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
