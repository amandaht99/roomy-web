"use client";
import Image from "next/image";
import { Box, Center, Flex, Menu, Spacer, Stack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { Divider } from "@chakra-ui/react";
import LogoPng from "../../public/images/roomylogo.png";
import MyMenu from "@/components/menu";
import SearchButton from "@/components/search-button";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <Flex
      direction={"row"}
      justifyContent="flex-start"
      alignItems="center"
      borderBottom="1px"
      gap={20}
      borderColor={"black"}
    >
      <Flex direction={"column"} justifyContent="center">
        <Link href={"/"}>
          <Image src={LogoPng} alt="Roomy Logo" width={160} />
        </Link>
      </Flex>
      <Flex
        direction={"row"}
        gap={20}
        alignItems={"center"}
        justifyContent={"flex-start"}
      >
        <Link href="/home">Home</Link>
        <Link href="/trips">Trips</Link>
        <Link href="/profile">Profile</Link>
      </Flex>
      <Spacer />
      <SearchButton />
      <Spacer />
      <Flex
        padding={"7px"}
        gap={"7px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <SignedIn>
          {/* If the user is signed in, user-button will be displayed*/}
          <UserButton />
        </SignedIn>
        <MyMenu />
      </Flex>
    </Flex>
  );
}
