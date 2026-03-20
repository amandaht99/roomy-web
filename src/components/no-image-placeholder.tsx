import { Box, Text, VStack } from "@chakra-ui/react";

export default function NoImagePlaceholder() {
  return (
    <Box
      bg="gray.50"
      border="1px dashed"
      borderColor="gray.200"
      w="100%"
      h="100%"
    >
      <VStack w="100%" h="100%" justify="center" align="center" gap={1}>
        <Text fontSize="xl" color="gray.400" lineHeight="1">
          📷
        </Text>
        <Text fontSize="xs" color="gray.400">
          No photos yet
        </Text>
      </VStack>
    </Box>
  );
}
