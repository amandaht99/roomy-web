"use client";

import MyCard from "@/components/card";
import {
  Steps,
  Heading,
  Text,
  Flex,
  IconButton,
  Spacer,
  Container,
  Tag,
  TagLabel,
  Stack,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { Property } from "@/components/property-info";
import { useProperties } from "@/context/properties-context";
import { toaster } from "@/components/ui/toaster";

// Home component displays a list of properties and allows to paginate through them
function Home() {
  const { properties, setProperties, filtersApplied, setFiltersApplied } =
    useProperties();
  const [currentPageProp, setCurrentPageProp] = useState(0);
  const [currentPageBook, setCurrentPageBook] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useEffect(() => {
    const cardWidth = 384;
    const cardParent = document.getElementById("cardParent");

    if (!cardParent) return;
    const calced = Math.floor(cardParent.clientWidth / cardWidth);
    setCardsPerPage(calced > 0 ? calced : 1);
  }, []);

  const [bookmarkedProperties, setBookmarkedProperties] = useState<Property[]>(
    [],
  );

  const { userId } = useAuth();

  // Fetches properties data from the server
  const fetchData = async () => {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/flats/all/${userId || null}`,
    );
    setFiltersApplied(false);
    setProperties(result.data);
  };

  // Removes filters and fetches all properties
  const removeFilters = async () => {
    fetchData();
    toaster.success({
      title: "Filter removed.",
      description: "Showing all flats without filters.",
    });
  };

  // Fetch data when component mounts
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

  // Component layout with properties cards and pagination
  return (
    <Container maxW="container.xl" py={10}>
      <VStack gap={8} align="start">
        <Heading as="h1" size="2xl" color="brand.900">
          Discover!
        </Heading>
        {filtersApplied ? (
          <Text ml={4}>
            <Tag.Root
              data-cy="filters-applied-tag"
              size="lg"
              borderRadius="full"
              variant="solid"
              bgColor="brand.900"
            >
              <Tag.Label>Filters</Tag.Label>
              <Tag.CloseTrigger onClick={removeFilters} />
            </Tag.Root>
          </Text>
        ) : null}
        <Stack gap={3} padding={"0px"} w={"100%"}>
          <Stack gap={1} padding={"20px"}>
            <Flex align={"stretch"}>
              <Text fontSize="2xl">You might like </Text>
              <Spacer />
              <HStack>
                <IconButton aria-label="Paginate left" onClick={goBackwardProp}>
                  <AiOutlineLeft />
                </IconButton>
                <IconButton aria-label="Paginate right" onClick={goForwardProp}>
                  <AiOutlineRight />
                </IconButton>
              </HStack>
            </Flex>
            <HStack id="cardParent" gap={7}>
              {properties
                .slice(
                  currentPageProp * cardsPerPage,
                  (currentPageProp + 1) * cardsPerPage,
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
          <Stack gap={1} padding={"20px"}>
            <Flex align={"stretch"}>
              <Text fontSize="2xl">Your bookmarks </Text>
              <Spacer />
              <HStack>
                <IconButton aria-label="Paginate left" onClick={goBackwardBook}>
                  <AiOutlineLeft />
                </IconButton>
                <IconButton aria-label="Paginate right" onClick={goForwardBook}>
                  <AiOutlineRight />
                </IconButton>
              </HStack>
            </Flex>
            <HStack gap={7}>
              {bookmarkedProperties
                .slice(
                  currentPageBook * cardsPerPage,
                  (currentPageBook + 1) * cardsPerPage,
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
