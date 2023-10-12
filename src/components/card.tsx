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
import { Stack, HStack, VStack } from "@chakra-ui/react";

import { IoIosSwap } from "react-icons/io";
import { AiTwotoneStar } from "react-icons/ai";
import { BsDot, BsBookmark, BsBookmarkFill } from "react-icons/bs";

export default function MyCard() {
  return (
    <Card w="sm" minWidth="sm">
      <CardBody>
        <Skeleton>
          ≈
          <Image
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt="Green double couch with wooden legs"
            borderRadius="lg"
          />
        </Skeleton>
        <Flex direction={"row"} mt="6" padding={"0px"} align={"stretch"}>
          {/* <Heading size="md">Living room Sofa</Heading> */}
          <Stack
            // spacing="3"
        
          >
            <Text fontSize={"15px"}>Maximilianstraße, Munich</Text>
            <Flex >
              <HStack>
                <Icon as={IoIosSwap} />
                <Text fontSize={"15px"}>Berlin</Text>
              </HStack>
              <Spacer />
              <Icon as={BsDot} />
              <Spacer />
              <Text fontSize={"15px"}>Oct 1-8</Text>
            </Flex>
          </Stack>
          <Spacer />
          <Stack align={"end"}>
            <HStack>
              <Icon as={AiTwotoneStar} />
              <Text fontSize={"15px"}>4.71</Text>
            </HStack>
            <Button
              flex="1"
              variant="ghost"
              leftIcon={<BsBookmark />}
              size={"sm"}
              padding={"0"}
            >
              Bookmark
            </Button>
          </Stack>
        </Flex>
      </CardBody>
    </Card>
  );
}
