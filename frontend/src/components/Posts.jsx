import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  VStack,
  Container,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import CreatePost from "../components/CreatePosts";

const communities = [
  "Community 1",
  "Community 2",
  "Community 3",
  "Community 4",
];

const initialPosts = [
  {
    id: 1,
    title: "Post Title 1",
    content: "Post content 1",
    likes: 23,
    profilePic:
      "https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177",
    community: "Community 1",
  },
  {
    id: 2,
    title: "Post Title 2",
    content: "Post content 2",
    likes: 45,
    profilePic:
      "https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177",
    community: "Community 2",
  },
  {
    id: 3,
    title: "Post Title 3",
    content: "Post content 3",
    likes: 12,
    profilePic:
      "https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177",
    community: "Community 3",
  },
  {
    id: 4,
    title: "Post Title 4",
    content: "Post content 4",
    likes: 67,
    profilePic:
      "https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177",
    community: "Community 4",
  },
  {
    id: 5,
    title: "Post Title 5",
    content: "Post content 5",
    likes: 34,
    profilePic:
      "https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177",
    community: "Community 1",
  },
  {
    id: 6,
    title: "Post Title 6",
    content: "Post content 6",
    likes: 89,
    profilePic:
      "https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177",
    community: "Community 2",
  },
  {
    id: 7,
    title: "Post Title 7",
    content: "Post content 7",
    likes: 23,
    profilePic:
      "https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177",
    community: "Community 3",
  },
  {
    id: 8,
    title: "Post Title 8",
    content: "Post content 8",
    likes: 78,
    profilePic:
      "https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177",
    community: "Community 4",
  },
  {
    id: 9,
    title: "Post Title 9",
    content: "Post content 9",
    likes: 56,
    profilePic:
      "https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177",
    community: "Community 1",
  },
  {
    id: 10,
    title: "Post Title 10",
    content: "Post content 10",
    likes: 11,
    profilePic:
      "https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177",
    community: "Community 2",
  },
];

const Posts = () => {
  const [posts, setPosts] = useState(initialPosts);

  const handleLike = async (postId) => {
    try {
      await axios.post("/api/likePost", { postId });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCreatePost = ({ content, community }) => {
    const newPost = {
      id: posts.length + 1,
      title: `Post Title ${posts.length + 1}`,
      content,
      likes: 0,
      profilePic:
        "https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177",
      community,
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <Container centerContent>
      <CreatePost communities={communities} onSubmit={handleCreatePost} />
      <VStack spacing={4} align="stretch" width="100%" mt={4}>
        {posts.map((post) => (
          <Box
            key={post.id}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            width="100%"
          >
            <Flex align="center" mb={2}>
              <Avatar src={post.profilePic} size="md" mr={4} />
              <Heading size="md">{post.title}</Heading>
            </Flex>
            <Text fontSize="sm" color="gray.500">
              {post.community}
            </Text>
            <Text>{post.content}</Text>
            <Flex justify="space-between" align="center" mt={2}>
              <Flex align="center">
                <Button size="sm" onClick={() => handleLike(post.id)}>
                  Like
                </Button>
                <Text ml={2}>
                  {post.likes} {post.likes === 1 ? "like" : "likes"}
                </Text>
              </Flex>
              <Button size="sm">Comments</Button>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Posts;
