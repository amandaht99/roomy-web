"use client";

import * as React from "react";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";
import { PropertiesProvider } from "@/context/properties-context";

// Custom brand color token (replaces previous theme setup from v2)
const colors = {
  brand: {
    900: { value: "#F13B07" },
  },
};

// Chakra v3 uses `createSystem` instead of the old theme + CacheProvider pattern
const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // v3: ChakraProvider now receives a `system` via `value`
    <ChakraProvider value={system}>
      <ClerkProvider
        appearance={{
          variables: {
            // Keep Clerk styling aligned with brand color
            colorPrimary: "#F13B07",
          },
        }}
      >
        <PropertiesProvider>{children}</PropertiesProvider>
      </ClerkProvider>
    </ChakraProvider>
  );
}
