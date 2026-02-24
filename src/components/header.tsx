"use client";
import NextLink from "next/link";
import Image from "next/image";
import { Steps, Flex, Spacer, Link } from "@chakra-ui/react";
import LogoPng from "../../public/images/roomylogo.png";
import MyMenu from "@/components/menu";
import SearchButton from "@/components/search-button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  //Main Header component contains navigation, search and menu
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
        <Link asChild>
          <NextLink href={"/"}>
            <Image src={LogoPng} alt="Roomy Logo" width={160} />
          </NextLink>
        </Link>
      </Flex>
      <Flex
        direction={"row"}
        gap={20}
        alignItems={"center"}
        justifyContent={"flex-start"}
      >
        <Link asChild>
          <NextLink href="/home">Home</NextLink>
        </Link>
        <Link asChild>
          <NextLink href="/trips">Trips</NextLink>
        </Link>
        <Link asChild>
          <NextLink href="/profile">Profile</NextLink>
        </Link>
      </Flex>
      <Spacer />
      {/* If user is on Home page Search button will be displayed */}
      {pathname === "/home" && <SearchButton />}
      <Spacer />
      <Flex
        padding={"7px"}
        gap={"7px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <SignedIn>
          {/* If the user is signed in, user-button will be displayed */}
          <UserButton afterSignOutUrl="/" showName />
        </SignedIn>
        <MyMenu />
      </Flex>
    </Flex>
  );
}
