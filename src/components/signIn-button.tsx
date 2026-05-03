import React from "react";
import { Steps, Button } from "@chakra-ui/react";
import Link from "next/link";

type SignInButtonProps = {
  redirectUrl?: string;
};

// A functional component for the sign-in button
function SignInButton({ redirectUrl }: SignInButtonProps) {
  const href = redirectUrl
    ? `/sign-in?redirectUrl=${encodeURIComponent(redirectUrl)}`
    : "/sign-in";

  return (
    <Button
      backgroundColor="brand.900"
      size="lg"
      data-cy="profile-sign-in-button"
    >
      <Link href={href}>Sign In</Link>
    </Button>
  );
}

export default SignInButton;
