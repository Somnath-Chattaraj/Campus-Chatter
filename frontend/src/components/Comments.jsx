import React from "react";
import { Box, Flex, Text, Avatar, VStack } from "@chakra-ui/react";

const Comments = ({ comments }) => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Comments
      </Text>
      <VStack spacing={4} align="stretch">
        {comments.map((comment) => (
          <Flex key={comment.id} align="center">
            <Avatar name={comment.username} src={comment.avatar} />
            <Box>
              <Text fontWeight="bold">{comment.username}</Text>
              <Text>{comment.content}</Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default Comments;
