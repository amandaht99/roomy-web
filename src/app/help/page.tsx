"use client";
import {
  Steps,
  Box,
  Heading,
  Text,
  VStack,
  Container,
  Accordion,
} from "@chakra-ui/react";

// HelpPage component displays a list of frequently asked questions and their answers
export default function HelpPage() {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack gap={8} align="start">
        <Heading as="h1" size="2xl" color="brand.900">
          Help & FAQs
        </Heading>
        <Text fontSize="lg">
          Here are some frequently asked questions to help you navigate Roomy.
          If you cannot find the answer you are looking for, feel free to
          contact us.
        </Text>

        <Accordion.Root multiple collapsible defaultValue={["how-it-works"]}>
          <Accordion.Item value="how-it-works">
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left" fontWeight="bold" color="white">
                How does Roomy work?
              </Box>

              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>

            <Accordion.ItemContent>
              <Accordion.ItemBody color="gray.200">
                Roomy is a home swapping platform. You can list your home, find
                a home you would like to stay in, and arrange a swap with the
                other homeowner. It is a cost effective and authentic way to
                travel.
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>

          <Accordion.Item value="sign-up">
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left" fontWeight="bold" color="white">
                How do I sign up?
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>

            <Accordion.ItemContent>
              <Accordion.ItemBody color="gray.200">
                Click on the “Join Roomy - Travel more, spend less!” button on
                our landing page. You will be redirected to the sign-up page
                where you can create your account.
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>

          <Accordion.Item value="list-home">
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left" fontWeight="bold" color="white">
                How do I list my home?
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>

            <Accordion.ItemContent>
              <Accordion.ItemBody color="gray.200">
                After signing up, navigate to your profile page and click on
                “Add property”. Fill in the details about your home. Once you
                have completed the form, your home will be listed on Roomy.
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>

          <Accordion.Item value="find-home">
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left" fontWeight="bold" color="white">
                How do I find a home to swap with?
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>

            <Accordion.ItemContent>
              <Accordion.ItemBody color="gray.200">
                On the home page, you can either search through all homes or use
                the search function to set some filters. Look for specific homes
                that suit your desires.
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>

          <Accordion.Item value="arrange-swap">
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left" fontWeight="bold" color="white">
                How do I arrange a home swap?
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>

            <Accordion.ItemContent>
              <Accordion.ItemBody color="gray.200">
                Once you have found a home you are interested in, you can
                bookmark it or you can send a swap request to the homeowner. If
                they are interested, you can arrange the details of the swap.
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>

          <Accordion.Item value="problems-during-stay">
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left" fontWeight="bold" color="white">
                What should I do if I encounter problems during my stay?
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>

            <Accordion.ItemContent>
              <Accordion.ItemBody color="gray.200">
                We recommend arranging all details, including emergency
                contacts, with the homeowner before your stay. If you encounter
                any issues during your stay, please contact us.
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </VStack>
    </Container>
  );
}
