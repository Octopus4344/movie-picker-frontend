"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { googleClientId, googleFrontendCallbackUrl } from "@/config/googleAuth";

// Assuming you have a Button component

export default function GoogleButton() {
  const googleSignInUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${googleFrontendCallbackUrl}&prompt=consent&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile&access_type=online`;
  // access_type=offline is for requesting refresh_token, use 'online' if not needed.

  return (
    <Button asChild variant="outline" className="w-full bg-transparent">
      <a
        href={googleSignInUrl}
        className="flex items-center justify-center text-white hover:text-black"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
          alt="Google logo"
          width={15}
          height={10}
          className="mr-2"
        />
        {/* TODO: Consider adding a Google icon SVG here */}
        Continue with Google
      </a>
    </Button>
  );
}
