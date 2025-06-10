"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { ProtectedRoute } from "@/components/protected-route";

export default function Home() {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      button.style.setProperty("--mouse-x", `${x}px`);
      button.style.setProperty("--mouse-y", `${y}px`);
    };
    const handleMouseEnter = (event: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      button.style.setProperty("--mouse-x", `${x}px`);
      button.style.setProperty("--mouse-y", `${y}px`);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <ProtectedRoute>
      <div className="bg-gradient-primary flex min-h-screen overflow-hidden">
        <div className="absolute top-36 px-10 sm:top-1/4 sm:left-10">
          <p className="max-w-[550px] text-4xl font-extrabold text-white sm:text-6xl">
            What would you like to watch today?
          </p>
          <Link
            href="/"
            ref={buttonRef}
            className="fill-cursor-button relative mt-8 inline-block max-w-36 overflow-hidden rounded border-1 border-white px-6 py-3 font-semibold text-white transition-colors duration-300 hover:text-black"
          >
            <span className="relative z-10 text-xl font-light">
              Pick me a movie
            </span>
          </Link>
        </div>

        <footer className="absolute right-0 bottom-0 left-0 p-4 text-center text-white">
          <p className="text-sm">Made with ❤️ by Duchy Lakomczuchy</p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
