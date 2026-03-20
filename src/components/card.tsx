"use client";
import {
  Steps,
  Card,
  Box,
  Skeleton,
  Button,
  Text,
  Icon,
  Flex,
  Spacer,
  Stack,
  HStack,
  Image,
} from "@chakra-ui/react";
import { IoIosSwap } from "react-icons/io";
import { AiTwotoneStar } from "react-icons/ai";
import { BsDot, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Property } from "./property-info";
import NoImagePlaceholder from "./no-image-placeholder";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";

//Defining the type for the props
interface MyCardProps {
  property: Property;
  setBookmarkedProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  showInBookmarks?: boolean;
}

//Card component displays all information about properties
export default function MyCard(props: MyCardProps) {
  const { property, setBookmarkedProperties, showInBookmarks = false } = props;

  const [isBookmarked, setBookmarked] = useState(false);

  if (process.env.NODE_ENV === "development") {
    console.log("Card property.images", {
      id: property.id,
      images: property.images,
    });
  }

  const handleBookmarkClick = () => {
    setBookmarked(!isBookmarked);

    if (!isBookmarked) {
      setBookmarkedProperties((prevProperties) => [
        ...prevProperties,
        property,
      ]);

      toaster.success({
        title: "Property bookmarked.",
        description: "You have successfully bookmarked this property.",
      });
    } else {
      setBookmarkedProperties((prevProperties) =>
        prevProperties.filter((p) => p.id !== property.id),
      );

      toaster.success({
        title: "Property unbookmarked.",
        description:
          "You have successfully removed this property from your bookmarks.",
      });
    }
  };

  return (
    <Card.Root w="sm" minWidth="sm">
      <Card.Body>
        <Skeleton loading={false}>
          <Box
            w="100%"
            borderRadius="lg"
            overflow="hidden"
            aspectRatio={16 / 9}
          >
            {property.images.length > 0 ? (
              <Image
                src={property.images[0]}
                alt="Flat image"
                h="100%"
                w="100%"
                objectFit="cover"
                loading="lazy"
              />
            ) : (
              <NoImagePlaceholder />
            )}
          </Box>
        </Skeleton>
        <Flex direction={"row"} mt="6" padding={"0px"} align={"stretch"}>
          <Stack>
            <Text fontSize={"15px"} data-cy="address-text">
              {property.address.street}, {property.address.city}
            </Text>
            <Flex>
              <HStack>
                <Icon asChild>
                  <IoIosSwap />
                </Icon>
                <Text fontSize={"15px"} data-cy="swap-city">
                  {property.swapWithCity}
                </Text>
              </HStack>
              <Spacer />
              <Icon asChild>
                <BsDot />
              </Icon>
              <Spacer />
              <Text fontSize={"15px"}>
                <span data-cy="date-from">
                  {format(parseISO(property.dateFrom), "dd MMM yy")}
                </span>
                {" - "}
                <span data-cy="date-to">
                  {format(parseISO(property.dateTo), "dd MMM yy")}
                </span>
              </Text>
            </Flex>
          </Stack>
          <Spacer />
          <Stack align={"end"}>
            <HStack>
              <Icon asChild>
                <AiTwotoneStar />
              </Icon>
              <Text fontSize={"15px"}>4.71</Text>
            </HStack>
            {!showInBookmarks && (
              <Button
                flex="1"
                variant="ghost"
                size={"sm"}
                padding={"0"}
                onClick={handleBookmarkClick}
                data-cy="bookmark-button"
                // This line is there to reflect the bookmarked state in the DOM
                data-bookmarked={isBookmarked}
              >
                {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}Bookmark
              </Button>
            )}
          </Stack>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
