"use client";
import {
  Card,
  CardBody,
  Skeleton,
  Image,
  Button,
  CardFooter,
  Heading,
  Text,
  Icon,
  IconButton,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { Stack, HStack, VStack, useToast } from "@chakra-ui/react";

import { IoIosSwap } from "react-icons/io";
import { AiTwotoneStar } from "react-icons/ai";
import { BsDot, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Property } from "./property-info";
import { format, parseISO } from "date-fns";
import { useState } from "react";

interface MyCardProps {
  property: Property;
  setBookmarkedProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  showInBookmarks?: boolean;
}

export default function MyCard(props: MyCardProps) {
  const { property, setBookmarkedProperties, showInBookmarks = false } = props;

  const [isBookmarked, setBookmarked] = useState(false);
  const toast = useToast();

  const handleBookmarkClick = () => {
    setBookmarked(!isBookmarked);

    if (!isBookmarked) {
      setBookmarkedProperties((prevProperties) => [
        ...prevProperties,
        property,
      ]);

      toast({
        title: "Property bookmarked.",
        description: "You have successfully bookmarked this property.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      setBookmarkedProperties((prevProperties) =>
        prevProperties.filter((p) => p.id !== property.id)
      );

      toast({
        title: "Property unbookmarked.",
        description:
          "You have successfully removed this property from your bookmarks.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Card w="sm" minWidth="sm">
      <CardBody>
        <Skeleton>
          ≈
          {/* <Image
            src={property.images[0]}
            alt="Flat image"
            borderRadius="lg"
          /> */}
        </Skeleton>
        <Flex direction={"row"} mt="6" padding={"0px"} align={"stretch"}>
          <Stack>
            <Text fontSize={"15px"}>
              {property.address.street}, {property.address.city}
            </Text>
            <Flex>
              <HStack>
                <Icon as={IoIosSwap} />
                <Text fontSize={"15px"}>{property.swapWithCity}</Text>
              </HStack>
              <Spacer />
              <Icon as={BsDot} />
              <Spacer />
              <Text fontSize={"15px"}>
                {format(parseISO(property.dateFrom), "dd MMM yy")} -
                {format(parseISO(property.dateTo), "dd MMM yy")}
              </Text>
            </Flex>
          </Stack>
          <Spacer />
          <Stack align={"end"}>
            <HStack>
              <Icon as={AiTwotoneStar} />
              <Text fontSize={"15px"}>4.71</Text>
            </HStack>
            {!showInBookmarks && (
              <Button
                flex="1"
                variant="ghost"
                leftIcon={isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
                size={"sm"}
                padding={"0"}
                onClick={handleBookmarkClick}
              >
                Bookmark
              </Button>
            )}
          </Stack>
        </Flex>
      </CardBody>
    </Card>
  );
}
