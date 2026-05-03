"use client";

import { Steps, VStack, Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import SignInButton from "./signIn-button";
import React from "react";

// NotsignedIn is a component that informs the user they need to be signed in to view the page
function NotsignedIn() {
  const pathname = usePathname();

  return (
    <VStack h={"90vh"} justifyContent={"center"}>
      <Text>You are not signed in!</Text>
      <Text>To view this page you must be signed in.</Text>
      <SignInButton redirectUrl={pathname} />
    </VStack>
  );
}

export default NotsignedIn;
