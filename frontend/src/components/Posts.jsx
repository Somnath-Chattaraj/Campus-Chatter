import React from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  IconButton,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { FaThumbsUp, FaCommentAlt } from "react-icons/fa";
import Comments from "./Comments";

const PostBox = () => {
  const post = {
    username: "John Doe",
    avatar: "https://bit.ly/dan-abramov",
    content: "This is a sample post content.",
    comments: [
      { id: 1, username: "Jane Smith", content: "Great post!" },
      { id: 2, username: "Alice Johnson", content: "Thanks for sharing!" },
    ],
    likes: 42,
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
      bg="white"
      boxShadow="md"
      maxW="md"
      mx="auto"
    >
      <HStack spacing={4} align="center">
        <Avatar name={post.username} src={post.avatar} />
        <Text fontWeight="bold" fontSize="lg">
          {post.username}
        </Text>
      </HStack>

      <Text mt={4}>{post.content}</Text>

      <Flex mt={4} align="center" justify="space-between">
        <HStack spacing={4}>
          <IconButton
            icon={<FaThumbsUp />}
            aria-label="Like"
            variant="outline"
            colorScheme="blue"
          />
          <Text>{post.likes}</Text>
        </HStack>
        <Button
          leftIcon={<FaCommentAlt />}
          variant="outline"
          colorScheme="blue"
        >
          Comment
        </Button>
      </Flex>

      <Comments comments={post.comments} />
    </Box>
  );
};

export default PostBox;
