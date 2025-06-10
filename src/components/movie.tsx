import Image from "next/image";
import { Rating } from "react-simple-star-rating";

import { Movie, MovieDetails } from "@/lib/types";

import { ReviewDialog } from "./review-dialog";

export const MovieTile = ({
  movie,
  review,
}: {
  movie: MovieDetails;
  review?: number;
}) => {
  return (
    <div className="group relative w-[250px] cursor-pointer rounded-lg shadow-lg">
      {" "}
      <Image
        src={movie.poster_url}
        alt={movie.title}
        width={250}
        height={375} // Standard poster aspect ratio (e.g., 250x375)
        className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
      />
      <div className="/* Wider than image */ /* User's specified style */ /* Adjusted heights for */ absolute bottom-0 left-1/2 flex h-[130px] w-[300px] -translate-x-1/2 flex-col overflow-hidden rounded-3xl bg-neutral-600/30 p-10 text-white backdrop-blur-[15px] transition-all duration-300 ease-in-out group-hover:h-[280px]">
        <div className="flex flex-grow flex-col justify-end">
          {" "}
          <div>
            {" "}
            {/* Apply group-hover utilities to change text behavior */}
            <p
              className="truncate text-lg font-semibold group-hover:text-pretty group-hover:whitespace-normal"
              title={movie.title}
            >
              {movie.title}
            </p>
            {review && (
              <div className="mt-1">
                <Rating
                  fillColor="white"
                  emptyColor="rgba(255,255,255,0.3)"
                  size={20}
                  readonly={true}
                  initialValue={review}
                  SVGclassName="inline-block"
                />
              </div>
            )}
            {!review && <ReviewDialog movieId={movie.id} />}
          </div>
          <div className="mt-2 opacity-0 transition-opacity delay-150 duration-300 ease-in-out group-hover:opacity-100">
            <p
              className="text-xs leading-snug text-gray-300"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 5, // Allow up to 5 lines for description
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {movie.overview}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
