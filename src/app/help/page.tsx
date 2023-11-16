"use client";
import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function HelpPage() {
  const router = useRouter();

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="start">
        <Heading as="h1" size="2xl" color="brand.900">
          Help & FAQs
        </Heading>
        <Text fontSize="lg">
          Here are some frequently asked questions to help you navigate Roomy.
          If you can't find the answer you're looking for, feel free to contact
          us.
        </Text>

        <Accordion allowToggle w="100%">
          <AccordionItem>
            <h2>
              <AccordionButton
                _expanded={{ bg: "brand.900", color: "white" }}
                _hover={{ bg: "brand.900", color: "white" }}
              >
                <Box flex="1" textAlign="left" fontWeight="bold">
                  How does Roomy work?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Roomy is a home-swapping platform. You can list your home, find a
              home you'd like to stay in, choose a time, and arrange a swap with
              the other homeowner. It's a cost-effective and authentic way to
              travel.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton
                _expanded={{ bg: "brand.900", color: "white" }}
                _hover={{ bg: "brand.900", color: "white" }}
              >
                <Box flex="1" textAlign="left" fontWeight="bold">
                  How do I sign up?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Click on the "Join Roomy today - Travel more, spend less!" button
              on our landing page. You'll be redirected to the sign-up page
              where you can create your account.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton
                _expanded={{ bg: "brand.900", color: "white" }}
                _hover={{ bg: "brand.900", color: "white" }}
              >
                <Box flex="1" textAlign="left" fontWeight="bold">
                  How do I list my home?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              After signing in, navigate to your profile page and click on
              "Upload Property". Fill in the details about your home. Once
              you've completed the form, your home will be listed on Roomy.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton
                _expanded={{ bg: "brand.900", color: "white" }}
                _hover={{ bg: "brand.900", color: "white" }}
              >
                <Box flex="1" textAlign="left" fontWeight="bold">
                  How do I find a home to swap with?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              On the home page, you can either search through all homes
              currently on Roomy, or you can use the search function to set some
              filters to look for specific homes that suit your desires.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton
                _expanded={{ bg: "brand.900", color: "white" }}
                _hover={{ bg: "brand.900", color: "white" }}
              >
                <Box flex="1" textAlign="left" fontWeight="bold">
                  How do I arrange a home swap?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Once you've found a home you're interested in, you can bookmark it
              or you can send a swap request to the homeowner. If they're
              interested, you can then arrange the details of the swap.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton
                _expanded={{ bg: "brand.900", color: "white" }}
                _hover={{ bg: "brand.900", color: "white" }}
              >
                <Box flex="1" textAlign="left" fontWeight="bold">
                  What if I need help during my stay?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              We recommend arranging all details, including emergency contacts,
              with the homeowner before your stay. If you encounter any issues
              during your stay, please contact us.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Container>
  );
}
