'use client'

import { Link } from "@chakra-ui/next-js";
import React from "react";

export default function Header() {
  return (
    <>
      <Link href="/home">Home</Link>
      <Link href="/swaps">Swaps</Link>
      <Link href="/profile">Profile</Link>
    </>
  );
}
