import Image from "next/image";
import { Rating } from "react-simple-star-rating";

import { Movie } from "@/lib/types";

export const MovieTile = ({ movie }: { movie: Movie }) => {
  return (
    <div className="group relative w-[250px] cursor-pointer rounded-lg shadow-lg">
      {" "}
      {/* Removed overflow-hidden */}
      <Image
        src={movie.film.poster_url}
        alt={movie.film.title}
        width={250}
        height={375} // Standard poster aspect ratio (e.g., 250x375)
        className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
      />
      <div className="/* Wider than image */ /* User's specified style */ /* Adjusted heights for */ absolute bottom-0 left-1/2 flex h-[130px] w-[300px] -translate-x-1/2 flex-col overflow-hidden rounded-3xl bg-neutral-600/30 p-10 text-white backdrop-blur-[15px] transition-all duration-300 ease-in-out group-hover:h-[280px]">
        {/* This inner div helps manage content flow and spacing */}
        <div className="flex flex-grow flex-col justify-end">
          {" "}
          {/* Pushes content to the bottom of the available space */}
          <div>
            {" "}
            {/* Wrapper for title and rating */}
            <p
              className="truncate text-lg font-semibold"
              title={movie.film.title}
            >
              {movie.film.title}
            </p>
            {movie.review && (
              <div className="mt-1">
                <Rating
                  fillColor="white"
                  emptyColor="rgba(255,255,255,0.3)"
                  size={20}
                  readonly={true}
                  initialValue={movie.review}
                  SVGclassName="inline-block"
                />
              </div>
            )}
          </div>
          {/* Description - appears smoothly on hover as space becomes available */}
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
              {movie.film.overview}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
