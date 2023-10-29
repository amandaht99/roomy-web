"use client";
// Profile.js
import { Box, Heading, VStack, SimpleGrid, Container } from "@chakra-ui/react";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import PropertyInfo from "../../components/property-info";
import UserInfo from "../../components/user-info";

const property = {
  image: [
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
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

const user = {
  name: "Jane Doe",
  description:
    "Some brief description about the user. This might include their interests, languages spoken etc.",
  email: "jane.doe@example.com",
  phone: "+123456789",
  profilePicture: "",
};

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
  return (
    <ChakraProvider theme={theme}>
      <Box bg="white" color="black">
        <Container maxW="container.xl" py={10}>
          <VStack spacing={8} align="start">
            <Heading as="h1" size="2xl" color="brand.900">
              Property Profile
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mt={5}>
              <PropertyInfo property={property} />
              <UserInfo user={user} />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}
