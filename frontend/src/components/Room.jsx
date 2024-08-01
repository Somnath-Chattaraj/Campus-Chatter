"use client";

import React from "react";
import { useThreads } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import { Box, VStack, Text, Heading, Button, Spinner } from "@chakra-ui/react";

export default function Room() {
  const { threads, isLoading, error } = useThreads();

  if (isLoading) {
    return (
      <Box p={5} textAlign="center">
        <Spinner size="lg" />
        <Text mt={4}>Loading threads...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={5} textAlign="center" color="red.500">
        <Text>An error occurred: {error.message}</Text>
      </Box>
    );
  }

  return (
    <Box
      p={5}
      maxW="xl"
      mx="auto"
      bg="gray.800"
      color="white"
      borderRadius="md"
    >
      <Heading mb={4} textAlign="center">
        Community Room
      </Heading>
      <VStack spacing={4} align="stretch">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <Box
              key={thread.id}
              bg="gray.700"
              p={4}
              borderRadius="md"
              shadow="md"
            >
              <Thread thread={thread} />
            </Box>
          ))
        ) : (
          <Text textAlign="center">No threads available</Text>
        )}
        <Box mt={4}>
          <Composer />
        </Box>
      </VStack>
    </Box>
  );
}
