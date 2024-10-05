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
} from "@chakra-ui/react";
import axios from "axios";
import CreatePost from "./CreatePosts";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.post(
        "/post/fetch",
        {
          page: page,
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
      setLoading(false);
      alert("Error fetching posts");
    }
  };

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get("/post/communities", {
          withCredentials: true,
        });
        setCommunities(response.data.college);
        console.log(response.data.college);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching communities:", err);
      }
    };
    // const fetchPosts = async () => {
    //   try {
    //     const response = await axios.get("/post/fetch", {
    //       withCredentials: true,
    //     });
    //     const posts = response.data.posts;
    //     setPosts(posts);
    //     setLoading(false);
    //   } catch (err) {
    //     setLoading(false);
    //     alert("Error fetching posts");
    //   }
    // };

    fetchCommunities();
    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleLike = async (postId) => {
    try {
      await axios.post("/post/like", { postId }, { withCredentials: true });
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
      "/post/create",
      {
        title: title,
        content: content,
        collegeId: community,
      },
      { withCredentials: true }
    );
    window.location.reload();
  };

  return (
    <Container centerContent>
      <SearchBar />
      {communities.length>0 && (
        <CreatePost communities={communities} onSubmit={handleCreatePost} />
      )}
      
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
                <Avatar
                  src="https://i.scdn.co/image/ab67616d0000b27377a3afdbf4d24dd545105177"
                  size="md"
                  mr={4}
                />
                <Heading size="md">{post.title}</Heading>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                {post.College.name}
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
