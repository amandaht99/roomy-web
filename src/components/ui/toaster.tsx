"use client";

import {
  createToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  Toaster as ChakraToasterBase,
} from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

// Chakra v3: the runtime supports render-function children, TS types can lag behind.
// We cast once here so the rest of the app stays clean.
const ChakraToaster = ChakraToasterBase as unknown as any;

export function Toaster() {
  return (
    <Portal>
      <ChakraToaster toaster={toaster}>
        {(toast: any) => (
          <Toast.Root width={{ md: "sm" }} insetInline={{ mdDown: "4" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" />
            ) : (
              <Toast.Indicator />
            )}

            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>

            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
}
