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
        <MenuGroup title="Profile">
          <MenuItem>Sign up</MenuItem>
          <MenuItem>Log in</MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="Other">
          <MenuItem>Add your home</MenuItem>
          <MenuItem>Help</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
