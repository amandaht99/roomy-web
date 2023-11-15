"use client";
import {
  Box,
  Heading,
  SimpleGrid,
  Container,
  VStack,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import MyCard from "@/components/card";
import { useAuth } from "@clerk/clerk-react";

import NotsignedIn from "@/components/not-signedIn";

// Framer motion variants for the animation
const variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const MotionBox = motion(Box);

export default function Trips() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <Spinner />;

  if (!isSignedIn) {
    return <NotsignedIn />;
  }
  return (
    <Box bg="white" color="black">
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="start">
          <Heading as="h1" size="2xl" color="brand.900">
            Your Next Trips
          </Heading>
          <Stack spacing={1} padding={"20px"}>
            <Text fontSize={"2xl"}>No Trips planned yet!</Text>
          </Stack>
        </VStack>
      </Container>
    </Box>
  );
}
