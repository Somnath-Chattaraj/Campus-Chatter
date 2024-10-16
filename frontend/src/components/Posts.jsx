import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
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
import { gsap } from "gsap";
import { useRef } from "react";

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
  const fetchInitialized = useRef(false);

  const fetchPosts = async (pageParam = page) => {
    try {
      let collegeId = selectedCommunity === "all" ? null : selectedCommunity;
      const response = await axios.post(
        "/api/post/fetch",
        {
          page: pageParam, // Use the page parameter
          collegeId,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      const posts = response.data.posts;
      setPosts((prevPosts) => [...prevPosts, ...posts]);
      if (response.data.isOver) {
        setHasMore(false);
      }
      setPage(pageParam + 1); // Increment the page parameter
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

  useEffect(() => {
    if (!fetchInitialized.current) {
      fetchInitialized.current = true;
      return;
    }
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1); // Call fetchPosts with page 1 to reset
  }, [selectedCommunity]);

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

  const postRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      postRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 }
    );
  }, [posts]);

  if (loading || loadingUser) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="black">
        <InfinitySpin color="#3182CE" size={80} />
      </Flex>
    );
  }

  if (!userDetails) {
    return <Navigate to="/login" />;
  }

  if (
    userDetails.username === null &&
    userDetails.collegeEmailVerified == false
  ) {
    return <Navigate to={`/addusername/${userDetails.user_id}`} />;
  }

  if (
    userDetails.username === null &&
    userDetails.collegeEmailVerified == true
  ) {
    return <Navigate to={`/addDetails/${userDetails.user_id}`} />;
  }

  return (
    <Container centerContent>
      <SearchBar />
      {communities && (
        <CreatePost communities={communities} onSubmit={handleCreatePost} />
      )}

      <Stack direction="row" spacing={4} mb={4} width="100%" paddingTop={5}>
        <Select
          value={selectedCommunity}
          onChange={(e) => setSelectedCommunity(e.target.value)}
        >
          <option value="all">All</option>
          {allCommunities.map((community) => (
            <option key={community.college_id} value={community.college_id}>
              {community.name}
            </option>
          ))}
        </Select>
      </Stack>

      <VStack spacing={6} align="stretch" width="100%" mt={4}>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          {posts.map((post) => (
            <Box
              ref={postRef}
              key={post.post_id}
              p={6}
              borderWidth={1}
              borderColor="gray.200"
              borderRadius="lg"
              boxShadow="lg"
              width="100%"
              mt={6}
              className="transition transform hover:-translate-y-1 hover:shadow-2xl duration-300"
              onClick={() => handlePostClick(post.post_id)}
            >
              <Flex align="center" mb={4}>
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

              <Flex justify="space-between" align="center" mt={4}>
                <Flex align="center">
                  <Text className="text-sm text-white bg-blue-500 rounded-md px-2 py-1 shadow-md">
                    {post.likes} {post.likes === 1 ? "like" : "likes"}
                  </Text>
                </Flex>
                <Flex align="center">
                  <Text className="text-sm text-white bg-green-500 rounded-md px-2 py-1 shadow-md">
                    {post._count?.Comments}{" "}
                    {post._count?.Comments === 1 ? "comment" : "comments"}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          ))}
        </InfiniteScroll>
      </VStack>
    </Container>
  );
};

export default Posts;
