import React from "react";
import { Button } from "@chakra-ui/react";
import Link from "next/link";

// A functional component for the sign-in button
function SignInButton() {
  return (
    <Button backgroundColor="brand.900" textColor={"white"} size="lg">
      <Link href="/sign-in">Sign In</Link>
    </Button>
  );
}

export default SignInButton;
