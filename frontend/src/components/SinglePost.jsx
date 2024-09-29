import React, { useEffect, useState } from "react";
import { GrLike } from "react-icons/gr";
import { AiFillLike } from "react-icons/ai";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Flex,
  Avatar,
  Button,
  Spinner,
  Center,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import CreateComment from "./CreateComment"; // Import the CreateComment component

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [postLiked, setPostLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/post/fetch/${id}`, {
          withCredentials: true,
        });
        setPost(response.data.post);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        alert("Error fetching post");
      }
    };

    const checkIfLiked = async () => {
      try {
        const response = await axios.post(
          `/post/liked`,
          { postId: id },
          { withCredentials: true }
        );
        if (response.data.postLiked) {
          setPostLiked(true);
        }
      } catch (error) {
        console.error("Error checking if post is liked:", error);
      }
    };

    fetchPost();
    checkIfLiked();
  }, [id]);

  const handleLike = async (postId) => {
    try {
      await axios.post("/post/like", { postId }, { withCredentials: true });
      setPost((prevPost) => ({ ...prevPost, likes: prevPost.likes + 1 }));
      setPostLiked(true);
    } catch (error) {
      try {
        await axios.post("/post/unlike", { postId }, { withCredentials: true });
        setPost((prevPost) => ({ ...prevPost, likes: prevPost.likes - 1 }));
        setPostLiked(false);
      } catch (error) {
        console.error("Error liking post:", error);
      }
    }
  };

  //   const handleCommentAdded = () => {
  //     // Refresh the comments after a new comment is added
  //     axios
  //       .get(`/post/fetch/${id}`, { withCredentials: true })
  //       .then((response) => setPost(response.data.post))
  //       .catch((error) => console.error("Error refreshing comments:", error));
  //   };

  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );

  if (!post)
    return (
      <Center h="100vh">
        <Text fontSize="xl">Post not found</Text>
      </Center>
    );

  return (
    <Box
      p={6}
      maxW="3xl"
      mx="auto"
      mt={8}
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      borderWidth={1}
    >
      <VStack spacing={4} align="start">
        <Flex align="center" w="full">
          <Avatar
            src="https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177"
            size="lg"
            mr={4}
          />
          <Box>
            <Heading size="lg">{post.title}</Heading>
            <Text fontSize="sm" color="gray.500">
              {post.College.name}
            </Text>
          </Box>
        </Flex>
        <Text fontSize="md" mt={4} color="gray.700">
          {post.content}
        </Text>
        <Flex w="full" justify="space-between" align="center" mt={4}>
          <Flex align="center">
            <Button
              colorScheme="teal"
              size="sm"
              variant="outline"
              onClick={() => handleLike(post.post_id)}
              leftIcon={postLiked ? <AiFillLike /> : <GrLike />}
            >
              {postLiked ? "Liked" : "Like"}
            </Button>
            <Text ml={2} color="gray.600">
              {post.likes} {post.likes === 1 ? "like" : "likes"}
            </Text>
          </Flex>
          <Button size="sm" colorScheme="teal" variant="solid">
            Comments
          </Button>
        </Flex>
        <Box mt={6} w="full">
          <Heading size="md" mb={4}>
            Comments
          </Heading>
          <Box w="full" mt={4}>
            <CreateComment postId={post.post_id} />
          </Box>

          {/* Displaying Comments */}
          {post.Comments.length > 0 ? (
            post.Comments.map((comment) => (
              <Box
                key={comment.comment_id}
                p={4}
                mb={4}
                bg="gray.50"
                borderRadius="md"
                boxShadow="sm"
                borderWidth={1}
              >
                <Flex align="center" mb={2}>
                  <Avatar
                    src="https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177"
                    size="sm"
                    mr={2}
                  />
                  <Text fontWeight="bold">{comment.User.name}</Text>
                </Flex>
                <Text fontSize="large" color="gray.700">
                  {comment.content}
                </Text>
              </Box>
            ))
          ) : (
            <Text color="gray.500">
              No comments yet. Be the first to comment!
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default SinglePost;
