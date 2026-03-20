"use client";

import { Card, Skeleton, Flex, Stack, HStack, Spacer } from "@chakra-ui/react";

const SkeletonAny = Skeleton as any;

export default function CardSkeleton() {
  return (
    <Card.Root w="sm" minWidth="sm">
      <Card.Body>
        <SkeletonAny
          startColor="gray.100"
          endColor="orange.50"
          borderRadius="lg"
          h="208px"
          w="100%"
        />

        <Flex direction="row" mt="6" padding="0px" align="stretch">
          <Stack gap={2} flex="1">
            <SkeletonAny
              startColor="gray.100"
              endColor="orange.50"
              h="4"
              w="72%"
            />

            <HStack>
              <SkeletonAny
                startColor="gray.100"
                endColor="orange.50"
                h="4"
                w="20%"
              />
              <SkeletonAny
                startColor="gray.100"
                endColor="orange.50"
                h="4"
                w="30%"
              />
              <Spacer />
              <SkeletonAny
                startColor="gray.100"
                endColor="orange.50"
                h="4"
                w="38%"
              />
            </HStack>
          </Stack>

          <Spacer />

          <Stack align="end" gap={2}>
            <SkeletonAny
              startColor="gray.100"
              endColor="orange.50"
              h="4"
              w="12"
            />
            <SkeletonAny
              startColor="gray.100"
              endColor="orange.50"
              h="7"
              w="20"
            />
          </Stack>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}