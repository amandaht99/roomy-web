"use client";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Container,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import MyCard from "@/components/card";

// Framer motion variants for the animation
const variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const MotionBox = motion(Box);

// Define color scheme
const colors = {
  brand: {
    900: "#F13B07",
  },
};

const theme = extendTheme({
  colors,
});

export default function Swaps() {
  /*  const swaps = [
    { id: 1, location: "Italy", date: "2022-07-20" },
    { id: 2, location: "Berlin", date: "2022-08-15" },
    // ...
  ]; */

  return (
    <ChakraProvider theme={theme}>
      <Box bg="white" color="black">
        <Container maxW="container.xl" py={10}>
          <VStack spacing={8} align="start">
            <Heading as="h1" size="2xl" color="brand.900">
              Your Next Trips
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
              {/*  {swaps.map((swap) => ( */}
              <MotionBox
                //key={swap.id}
                p={5}
                bg="white"
                boxShadow="md"
                rounded="md"
                initial="hidden"
                animate="show"
                variants={variants}
                whileHover={{ y: -10 }}
              >
                <MyCard />
                {/* <Box p="6">
                    <Box d="flex" alignItems="baseline">
                      <Heading as="h4" size="md" fontWeight="semibold" lineHeight="tight" isTruncated color="brand.900">
                        {swap.location}
                      </Heading>
                    </Box>

                    <Box>
                      <Text mt="2" color="gray.500">
                        Swap Date: {swap.date}
                      </Text>
                    </Box>
                  </Box> */}
              </MotionBox>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}
