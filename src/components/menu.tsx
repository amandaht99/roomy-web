"use client";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  IconButton,
} from "@chakra-ui/react";
import Link from "next/link";

import { SignedOut } from "@clerk/nextjs";

//MyMenu is a component that renders a dropdown menu
export default function MyMenu() {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
        // border={"1px"}
        stroke={"0.5px"}
        backgroundColor={"lightgrey"}
      />
      <MenuList>
        <SignedOut>
          <MenuGroup title="Profile">
            <Link href="/sign-up">
              <MenuItem>Sign up</MenuItem>
            </Link>
            <Link href="/sign-in">
              <MenuItem>Sign in</MenuItem>
            </Link>
          </MenuGroup>
          <MenuDivider />
        </SignedOut>
        <MenuGroup title="Other">
          <Link href="/help">
            <MenuItem>Help</MenuItem>
          </Link>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
