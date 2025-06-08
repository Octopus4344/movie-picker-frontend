"use client";

import { Button } from "@/components/ui/button";
import { googleClientId, googleFrontendCallbackUrl } from "@/config/googleAuth";

// Assuming you have a Button component

export default function GoogleButton() {
  const googleSignInUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${googleFrontendCallbackUrl}&prompt=consent&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile&access_type=online`;
  // access_type=offline is for requesting refresh_token, use 'online' if not needed.

  return (
    <Button asChild variant="outline" className="w-full">
      <a href={googleSignInUrl}>
        {/* TODO: Consider adding a Google icon SVG here */}
        Sign in with Google
      </a>
    </Button>
  );
}
