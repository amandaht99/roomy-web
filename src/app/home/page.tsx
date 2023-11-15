"use client";
import React from "react";
import MyCard from "@/components/card";
import {
  Heading,
  Text,
  Flex,
  IconButton,
  Spacer,
  Container,
  Tag,
  TagCloseButton,
  TagLabel,
  useToast,
} from "@chakra-ui/react";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { Property } from "@/components/property-info";
import { useProperties } from "@/context/properties-context";

function Home() {
  const { properties, setProperties, filtersApplied, setFiltersApplied } =
    useProperties();
  const [currentPageProp, setCurrentPageProp] = useState(0);
  const [currentPageBook, setCurrentPageBook] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const toast = useToast();

  const cardWidth = 384;
  const cardParent = document.getElementById("cardParent");

  useEffect(() => {
    if (!cardParent) return;
    const calced = Math.floor(cardParent.clientWidth / cardWidth);
    setCardsPerPage(calced > 0 ? calced : 1);
  }, [cardParent]);

  const [bookmarkedProperties, setBookmarkedProperties] = useState<Property[]>(
    []
  );

  const { userId } = useAuth();

  const fetchData = async () => {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_DATABASE_URL}/v1/flats/all/${userId || null}`
    );
    setFiltersApplied(false);
    setProperties(result.data);
  };

  const removeFilters = async () => {
    fetchData();
    toast({
      title: "Filter removed.",
      description: "Showing all flats without filters.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty array means this effect runs once when the component mounts

  const goBackwardProp = () => {
    if (currentPageProp > 0) {
      setCurrentPageProp(currentPageProp - 1);
    }
  };

  const goForwardProp = () => {
    if ((currentPageProp + 1) * cardsPerPage < properties.length) {
      setCurrentPageProp(currentPageProp + 1);
    }
  };

  const goBackwardBook = () => {
    if (currentPageBook > 0) {
      setCurrentPageBook(currentPageBook - 1);
    }
  };

  const goForwardBook = () => {
    if ((currentPageBook + 1) * cardsPerPage < properties.length) {
      setCurrentPageBook(currentPageBook + 1);
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="start">
        <Heading as="h1" size="2xl" color="brand.900">
          Discover!
        </Heading>
        {filtersApplied ? (
          <Text ml={4}>
            <Tag
              size="lg"
              borderRadius="full"
              variant="solid"
              bgColor="brand.900"
            >
              <TagLabel>Filters</TagLabel>
              <TagCloseButton onClick={removeFilters} />
            </Tag>
          </Text>
        ) : null}
        <Stack spacing={3} padding={"0px"} w={"100%"}>
          <Stack spacing={1} padding={"20px"}>
            <Flex align={"stretch"}>
              <Text fontSize="2xl">You might like </Text>
              <Spacer />
              <HStack>
                <IconButton
                  aria-label="Paginate left"
                  icon={<AiOutlineLeft />}
                  onClick={goBackwardProp}
                />
                <IconButton
                  aria-label="Paginate right"
                  icon={<AiOutlineRight />}
                  onClick={goForwardProp}
                />
              </HStack>
            </Flex>
            <HStack id="cardParent" spacing={7}>
              {properties
                .slice(
                  currentPageProp * cardsPerPage,
                  (currentPageProp + 1) * cardsPerPage
                )
                .map((property) => (
                  <MyCard
                    property={property}
                    key={property.id}
                    setBookmarkedProperties={setBookmarkedProperties}
                  />
                ))}
            </HStack>
          </Stack>
          <Stack spacing={1} padding={"20px"}>
            <Flex align={"stretch"}>
              <Text fontSize="2xl">Your bookmarks </Text>
              <Spacer />
              <HStack>
                <IconButton
                  aria-label="Paginate left"
                  icon={<AiOutlineLeft />}
                  onClick={goBackwardBook}
                />
                <IconButton
                  aria-label="Paginate right"
                  icon={<AiOutlineRight />}
                  onClick={goForwardBook}
                />
              </HStack>
            </Flex>
            <HStack spacing={7}>
              {bookmarkedProperties
                .slice(
                  currentPageBook * cardsPerPage,
                  (currentPageBook + 1) * cardsPerPage
                )
                .map((property) => (
                  <MyCard
                    key={property.id}
                    property={property}
                    setBookmarkedProperties={setBookmarkedProperties}
                    showInBookmarks={true}
                  />
                ))}
            </HStack>
          </Stack>
        </Stack>
      </VStack>
    </Container>
  );
}

export default Home;
