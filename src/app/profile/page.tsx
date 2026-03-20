"use client";
import {
  Steps,
  Heading,
  VStack,
  Container,
  Spinner,
  Flex,
  Stack,
} from "@chakra-ui/react";
import PropertyInfo from "../../components/property-info";
import NotsignedIn from "@/components/not-signedIn";
import { SignOutButton, useUser } from "@clerk/nextjs";

//Profile component displays the user's property information
export default function Profile() {
  const { isSignedIn, isLoaded } = useUser();

  // Shows spinner while loading
  if (!isLoaded) return <Spinner />;

  // If user is not signed in, show NotSignedIn component
  if (!isSignedIn) {
    return <NotsignedIn />;
  }

  // Component layout with property information
  return (
    <Container maxW="container.xl" py={10}>
      <VStack gap={8} align="start">
        <Heading as="h1" size="2xl" color="brand.900">
          Property Profile
        </Heading>
        <Stack gap={1} padding={"20px"}>
          <Heading as="h2" size="xl" color="black">
            Your Place
          </Heading>
          <Flex maxW={900}>
            <PropertyInfo />
          </Flex>
          <SignOutButton data-cy="profile-sign-out-button" />
        </Stack>
      </VStack>
    </Container>
  );
}
