"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUser } from "@/context/user-context";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export const Navbar = () => {
  const path = usePathname();
  const { clearUser, logout } = useUser();

  const handleLogout = () => {
    logout();
    clearUser();
  };

  if (path === "/login" || path === "/sign-in" || path === "/google/callback") {
    return null;
  }

  return (
    <nav className="absolute w-full px-10 py-4 lg:px-24">
      <div className="mx-auto hidden items-center justify-between md:flex">
        <Link href={"/"}>
          <Image
            src="/logo.svg"
            width={150}
            height={60}
            alt="Movie Picker"
          ></Image>
        </Link>
        <div className="flex items-center space-x-10">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white">
            My Reviews
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white">
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            className="cursor-pointer text-gray-300 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
      <Sheet>
        <div className="flex items-center justify-between md:hidden">
          <Link href={"/"}>
            <Image
              src="/logo.svg"
              width={80}
              height={60}
              alt="Movie Picker"
            ></Image>
          </Link>
          <SheetTrigger className="flex pt-4 text-white md:hidden">
            <HamburgerMenuIcon width={25} height={25} />
          </SheetTrigger>
        </div>
        <SheetContent className="border-0 bg-neutral-600/30 p-10 text-gray-300 backdrop-blur-[30px]">
          <SheetTitle />
          <div className="mt-6 flex flex-col items-start justify-between space-y-10">
            <Link href="/" className="text-gray-300 hover:text-white">
              Home
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white">
              My Reviews
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white">
              My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="cursor-pointer text-gray-300 hover:text-white"
            >
              Logout
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
