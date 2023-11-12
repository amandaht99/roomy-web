"use client";
import {
  Box,
  Heading,
  VStack,
  SimpleGrid,
  Container,
  Spinner,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import PropertyInfo from "../../components/property-info";
import { useUser } from "@clerk/clerk-react";

import NotsignedIn from "@/components/not-signedIn";

const property = {
  images: [
    "https://cdn.apartmenttherapy.info/image/upload/v1619013756/at/house%20tours/2021-04/Erin%20K/KERR-130-CLARKSON-2R-01-020577-EDIT-WEB.jpg",
    "https://www.mastrid.com/wp-content/uploads/2021/02/DepaSantaCatalina.jpg",
    "https://dom.com.cy/upload/resize_cache/iblock/7cb/870_654_2/7cb9955a62fb012942910a0882e3cadd.jpg",
  ],
  name: "Beautiful Apartment",
  description:
    "Some description about the property. This could include details about the location, amenities, size etc.",
  location: "Property Location, City",
  reviews: [
    "Great location, near to several tourist attractions.",
    "The apartment was clean and spacious.",
    "I loved the amenities provided.",
  ],
};

// const user = {
//   name: "Jane Doe",
//   description:
//     "Some brief description about the user. This might include their interests, languages spoken etc.",
//   email: "jane.doe@example.com",
//   phone: "+123456789",
//   profilePicture: "",
// };

// Define color scheme
const colors = {
  brand: {
    900: "#F13B07",
  },
};

const theme = extendTheme({
  colors,
});

export default function Profile() {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded) return <Spinner />;

  if (!isSignedIn) {
    return <NotsignedIn />;
  }

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
        </Stack>
      </VStack>
    </Container>
  );
}
