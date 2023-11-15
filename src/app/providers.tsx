"use client";

import { PropertiesProvider } from "@/context/properties-context";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";

// Define color scheme
const colors = {
  brand: {
    900: "#F13B07",
  },
};

const theme = extendTheme({
  colors,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#F13B07",
            },
          }}
        >
          <PropertiesProvider>{children}</PropertiesProvider>
        </ClerkProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
