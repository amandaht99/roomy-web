"use client";
import {
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

//Sample pictures data
const property = {
  images: [
    "https://cdn.apartmenttherapy.info/image/upload/v1619013756/at/house%20tours/2021-04/Erin%20K/KERR-130-CLARKSON-2R-01-020577-EDIT-WEB.jpg",
    "https://www.mastrid.com/wp-content/uploads/2021/02/DepaSantaCatalina.jpg",
    "https://dom.com.cy/upload/resize_cache/iblock/7cb/870_654_2/7cb9955a62fb012942910a0882e3cadd.jpg",
  ],
};

//Profile component displays the user's property information
export default function Profile() {
  const { isSignedIn, isLoaded, user } = useUser();

  // Shows spinner while loading
  if (!isLoaded) return <Spinner />;

  // If user is not signed in, show NotSignedIn component
  if (!isSignedIn) {
    return <NotsignedIn />;
  }

  // Component layout with property information
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="start">
        <Heading as="h1" size="2xl" color="brand.900">
          Property Profile
        </Heading>
        <Stack spacing={1} padding={"20px"}>
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
