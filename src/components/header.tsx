"use client";
import Image from "next/image";
import { Box, Center, Flex, Menu, Spacer, Stack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { Divider } from "@chakra-ui/react";
import LogoPng from "../../public/images/roomylogo.png";
import MyMenu from "@/components/menu"
import SearchButton from "@/components/search-button";



export default function Header() {
  return (
    <Flex
      direction={"row"}
      justifyContent="flex-start"
      alignItems="center"
      borderBottom="thin"
      gap={20}
      border={"1px"}
      borderColor={"red"}
    >
      <Flex
        direction={"column"}
        justifyContent="center"
        border={"1px"}
        borderColor={"purple"}
      >
        <Link href={"/"}>
          <Image src={LogoPng} alt="Roomy Logo" width={160} />
        </Link>
      </Flex>
      <Flex
        direction={"row"}
        gap={20}
        border={"1px"}
        borderColor={"pink"}
        alignItems={"center"}
        justifyContent={"flex-start"}
      >
        <Link href="/home">Home </Link>
        <Link href="/swaps">Swaps </Link>
        <Link href="/profile">Profile </Link>
      </Flex>
      <Spacer/>
      <SearchButton />
      <Spacer/>
      <Flex padding={"7px"}>
        <MyMenu />
      </Flex>
    </Flex>
  );
}
