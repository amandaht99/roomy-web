import React from "react";
import MyCard from "@/components/card";
import {
  Heading,
  Text,
  Image,
  Divider,
  Button,
  Flex,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

function Home() {
  return (
    <Stack spacing={3} padding={"30px"}>
      <Stack spacing={1} padding={"20px"}>
        <Flex align={"stretch"}>
          <Text fontSize="2xl">You might like </Text>
          <Spacer />
          <HStack>
            <IconButton aria-label="Paginate left" icon={<AiOutlineLeft />} />
            <IconButton aria-label="Paginate right" icon={<AiOutlineRight />} />
          </HStack>
        </Flex>
        <HStack spacing={7}>
          <MyCard />
          <MyCard />
          <MyCard />
          {/*          
          {flats.map((flat) => {
            
            <MyCard
              name={flat}
            />

          })} */}
        </HStack>
      </Stack>
      <Stack spacing={1} padding={"20px"}>
        <Flex align={"stretch"}>
          <Text fontSize="2xl">Your bookmarks </Text>
          <Spacer />
          <HStack>
            <IconButton aria-label="Paginate left" icon={<AiOutlineLeft />} />
            <IconButton aria-label="Paginate right" icon={<AiOutlineRight />} />
          </HStack>
        </Flex>
        <HStack spacing={7}>
          <MyCard />
          <MyCard />
          <MyCard />
        </HStack>
      </Stack>
    </Stack>
  );
}

export default Home;
