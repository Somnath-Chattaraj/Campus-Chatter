import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  VStack,
  Container,
  Heading,
  Stack,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import CreatePost from "./CreatePosts";
import InfiniteScroll from "react-infinite-scroll-component";
import { Navigate, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useUser } from "../hook/useUser";
import Loader from "./loading";
import { InfinitySpin } from "react-loader-spinner";
import { set } from "zod";
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState("all");
  const [allCommunities, setAllCommunities] = useState([]);
  const [page, setPage] = useState(1);
  const { userDetails, loadingUser } = useUser();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let collegeId;
      if (selectedCommunity === "all") {
        collegeId = null;
      } else {
        collegeId = selectedCommunity;
      }
      const response = await axios.post(
        "/api/post/fetch",
        {
          page: page,
          collegeId,
        },
        {
          withCredentials: true,
        }
      );
      const posts = response.data.posts;
      setPosts((prevPosts) => [...prevPosts, ...posts]);
      if (response.data.isOver == true) {
        setHasMore(false);
      }
      setPage(page + 1);
      setLoading(false);
    } catch (err) {
      if (err.response.status === 401) {
        toast({
          title: "Please login to view posts",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setLoading(false);
      alert("Error fetching posts");
    }
  };

  const handleCommunityChange = async (e) => {
    setSelectedCommunity(e.target.value);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts();
  };

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/post/communities", {
          withCredentials: true,
        });
        setCommunities(response.data.college);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching communities:", err);
      }
    };

    fetchCommunities();
    fetchPosts();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchAllCommunities = async () => {
      try {
        const response = await axios.get("/api/post/allcommunities", {
          withCredentials: true,
        });
        setAllCommunities(response.data.college);
        console.log(response.data.college);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching all communities:", err);
      }
    };
    fetchAllCommunities();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleLike = async (postId) => {
    try {
      await axios.post("/api/post/like", { postId }, { withCredentials: true });
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.post_id === postId) {
            return { ...post, likes: post.likes + 1 };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCreatePost = async ({ title, content, community }) => {
    const response = await axios.post(
      "/api/post/create",
      {
        title: title,
        content: content,
        collegeId: community,
      },
      { withCredentials: true }
    );
    window.location.reload();
  };
  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="black">
        <InfinitySpin color="#3182CE" size={80} />
      </Flex>
    );
  }
  if (loadingUser) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="black">
        <InfinitySpin color="#3182CE" size={80} />
      </Flex>
    );
  }
  if (!userDetails) {
    return <Navigate to="/login" />;
  }
  return (
    <Container centerContent>
      <SearchBar />
      {communities && (
        <CreatePost communities={communities} onSubmit={handleCreatePost} />
      )}
      <Stack direction="row" spacing={4} mb={4} width="100%" paddingTop={5}>
        <Select value={selectedCommunity} onChange={handleCommunityChange}>
          <option value="all">All</option>

          {allCommunities.map((community) => (
            <option key={community.college_id} value={community.college_id}>
              {community.name}
            </option>
          ))}
        </Select>
      </Stack>

      <VStack spacing={4} align="stretch" width="100%" mt={4}>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          {posts.map((post) => (
            <Box
              key={post.post_id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              width="100%"
              marginTop={3}
              onClick={() => handlePostClick(post.post_id)}
            >
              <Flex align="center" mb={2}>
                <Avatar src={post.User.pic} size="md" mr={4} />
                <Heading size="md">{post.title}</Heading>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                {post.College.name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {post.User.username}
              </Text>
              <Text>{post.content}</Text>
              <Flex justify="space-between" align="center" mt={2}>
                <Flex align="center">
                  <Button size="sm" onClick={() => handleLike(post.post_id)}>
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
        </InfiniteScroll>
      </VStack>
    </Container>
  );
};

export default Posts;
