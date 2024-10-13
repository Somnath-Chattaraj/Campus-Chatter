import React, { useEffect, useState } from "react";
import { GrLike } from "react-icons/gr";
import { AiFillLike } from "react-icons/ai";
import { useParams, Navigate } from "react-router-dom";
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
  useToast,
} from "@chakra-ui/react";
import { gsap } from "gsap";
import axios from "axios";
import CreateComment from "./CreateComment";
import { useUser } from "../hook/useUser";
import { InfinitySpin } from "react-loader-spinner";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postLiked, setPostLiked] = useState(false);
  const { userDetails, loadingUser } = useUser();

  // Refs for the animations
  const likeButtonRef = React.useRef(null);
  const likeFloodRef = React.useRef(null);
  const toast = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/post/fetch/${id}`, {
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
          `/api/post/liked`,
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

  if (loadingUser) {
    return (
      <Center h="100vh">
        <InfinitySpin />
      </Center>
    );
  }

  if (!userDetails) {
    toast({
      title: "Please login to view this page",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return <Navigate to="/login" />;
  }
  if (userDetails.username === null) {
    return <Navigate to={`/addusername/${userDetails.userId}`} />;
  }

  const handleLike = async (postId) => {
    const timeline = gsap.timeline();

    timeline.to(likeButtonRef.current, {
      scale: 1.5,
      duration: 0.2,
      ease: "power2.inOut",
    });
    timeline.to(likeButtonRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power2.inOut",
    });

    if (!postLiked) {
      gsap
        .to(likeFloodRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        })
        .then(() => {
          gsap.to(likeFloodRef.current, {
            opacity: 0,
            scale: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
              // Hide the box after the animation is complete
              gsap.set(likeFloodRef.current, { opacity: 0, scale: 1 });
            },
          });
        });
    }

    if (postLiked) {
      try {
        await axios.post(
          "/api/post/unlike",
          { postId },
          { withCredentials: true }
        );
        setPost((prevPost) => ({ ...prevPost, likes: prevPost.likes - 1 }));
        setPostLiked(false);
      } catch (error) {
        console.error("Error unliking post:", error);
      }
    } else {
      try {
        await axios.post(
          "/api/post/like",
          { postId },
          { withCredentials: true }
        );
        setPost((prevPost) => ({ ...prevPost, likes: prevPost.likes + 1 }));
        setPostLiked(true);
      } catch (error) {
        console.error("Error liking post:", error);
      }
    }
  };

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
      bg="gray.900"
      borderRadius="md"
      boxShadow="lg"
      borderWidth={1}
      color="whiteAlpha.900"
    >
      <VStack spacing={4} align="start">
        <Flex align="center" w="full">
          <Avatar src={post.User.pic} size="lg" mr={4} />
          <Box>
            <Heading size="lg" color="whiteAlpha.900">
              {post.title}
            </Heading>
            <Text fontSize="sm" color="gray.400">
              {post.College.name}
            </Text>
            <Text fontSize="sm" color="gray.400">
              {post.User.username}
            </Text>
          </Box>
        </Flex>
        <Text fontSize="md" mt={4} color="gray.300">
          {post.content}
        </Text>
        <Flex w="full" justify="space-between" align="center" mt={4}>
          <Flex align="center">
            <Button
              ref={likeButtonRef}
              colorScheme="teal"
              size="sm"
              variant="outline"
              onClick={() => handleLike(post.post_id)}
              leftIcon={postLiked ? <AiFillLike /> : <GrLike />}
              className="like-button"
            >
              {postLiked ? "Liked" : "Like"}
            </Button>
            <Text ml={2} color="gray.400">
              {post.likes} {post.likes === 1 ? "like" : "likes"}
            </Text>
          </Flex>
          <Button size="sm" colorScheme="teal" variant="solid">
            Comments
          </Button>
        </Flex>
        <Box
          ref={likeFloodRef}
          className="like-flood-animation"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            opacity: 0,
            transform: "translate(-50%, -50%)",
            fontSize: "2rem",
            pointerEvents: "none",
          }}
        >
          💖💖💖💖💖💖💖💖💖💖💖💖
        </Box>
        <Box mt={6} w="full">
          <Heading size="md" mb={4} color="whiteAlpha.900">
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
                bg="gray.800"
                color="whiteAlpha.900"
                borderRadius="md"
                boxShadow="sm"
                borderWidth={1}
              >
                <Flex align="center" mb={2}>
                  <Avatar src={comment.User.pic} size="sm" mr={2} />
                  <Text fontWeight="bold" color="whiteAlpha.900">
                    {comment.User.username}
                  </Text>
                </Flex>
                <Text fontSize="large" color="gray.300">
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
