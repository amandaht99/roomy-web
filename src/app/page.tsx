"use client";
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Container,
  Icon,
  Button,
  Flex,
} from "@chakra-ui/react";
import { FaEuroSign, FaHome, FaGlobeAmericas, FaUsers } from "react-icons/fa";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { motion } from "framer-motion";

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

export default function Page() {
  return (
    <ChakraProvider theme={theme}>
      <Box bg="white" color="black">
        <Container maxW="container.xl" py={10}>
          <VStack spacing={8} align="start">
            <Heading as="h1" size="2xl" color="brand.900">
              Welcome to Roomy!
            </Heading>
            <Text fontSize="lg">
              Immerse yourself in a new culture, live like a local, and save on
              accommodation costs - all with Roomy! At Roomy, we believe travel
              is not just about seeing new places, but experiencing them like a
              local. We are your gateway to authentic travel experiences,
              providing a platform to swap homes with others who share your
              wanderlust.
            </Text>

            <Heading as="h2" size="xl">
              Why Choose Roomy?
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} mt={5}>
              {[
                {
                  title: "Cost-Effective Travel",
                  description:
                    "Swap homes instead of spending on hotels. Say goodbye to expensive rentals, and embrace a cost-effective way of exploring the world.",
                  icon: FaEuroSign,
                },
                {
                  title: "Authentic Experiences",
                  description:
                    "Live where the locals live. Experience cities, neighbourhoods, and lifestyles - not as tourists, but as residents.",
                  icon: FaHome,
                },
                {
                  title: "Trusted Community",
                  description:
                    "Our members understand and value the trust needed to open their homes. We ensure a safe and reliable home-swapping experience.",
                  icon: FaUsers,
                },
                {
                  title: "Global Access",
                  description:
                    "With properties across the globe, your dream vacation is just a swap away. City apartments, country cottages, beachfront villas? You name it!",
                  icon: FaGlobeAmericas,
                },
              ].map((card, index) => (
                <MotionBox
                  key={index}
                  p={5}
                  bg="white"
                  boxShadow="md"
                  rounded="md"
                  initial="hidden"
                  animate="show"
                  variants={variants}
                  whileHover={{ y: -10 }}
                >
                  <Flex direction="column" align="start" spacing={3}>
                    <Icon as={card.icon} boxSize={6} color="brand.900" />
                    <Heading as="h3" size="md" color="brand.900">
                      {card.title}
                    </Heading>
                    <Text>{card.description}</Text>
                  </Flex>
                </MotionBox>
              ))}
            </SimpleGrid>

            <Button colorScheme="red" size="lg">
              Join Roomy today - Travel more, spend less!
            </Button>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}
