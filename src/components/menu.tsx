"use client";

import * as React from "react";
import Link from "next/link";
import { IconButton, Menu, Portal } from "@chakra-ui/react";
import { SignedOut } from "@clerk/nextjs";
import { LuMenu } from "react-icons/lu";

export default function MyMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          aria-label="Options"
          variant="outline"
          backgroundColor="lightgrey"
        >
          <LuMenu />
        </IconButton>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <SignedOut>
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>Profile</Menu.ItemGroupLabel>

                <Menu.Item value="sign-up" asChild>
                  <Link href="/sign-up">Sign up</Link>
                </Menu.Item>

                <Menu.Item value="sign-in" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Menu.Item>
              </Menu.ItemGroup>
            </SignedOut>

            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Other</Menu.ItemGroupLabel>

              <Menu.Item value="help" asChild>
                <Link href="/help">Help</Link>
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
