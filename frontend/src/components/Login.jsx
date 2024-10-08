import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase.js";
import { signInWithPopup } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google login result: ");
      const response = await axios.post(
        "/user/google",
        {
          email: user.email,
          displayName: user.displayName,
        },
        { withCredentials: true }
      );
      if (response.data.isCollegeEmail === true) {
        toast({
          title: "Signup successful.",
          description: "Add college details to continue.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate(`/addDetails/${response.data.userId}`);
        return;
      } else if (!response.data.username) {
        toast({
          title: "Signup successful.",
          description: "You are being redirected to add username.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/addusername");
        return;
      }
      toast({
        title: "Login successful.",
        description: "You are being redirected to the posts page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/posts");
    } catch (error) {
      console.error("Google login error: ", error);
      toast({
        title: "Login failed.",
        description: error.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const response = await axios.post(
        "/user/github",
        {
          email: user.email,
          displayName: user.displayName,
        },
        { withCredentials: true }
      );
      if (response.data.isCollegeEmail === true) {
        toast({
          title: "Signup successful.",
          description: "Add college details to continue.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate(`/addDetails/${response.data.userId}`);
        return;
      } else if (!response.data.username) {
        toast({
          title: "Signup successful.",
          description: "You are being redirected to add username.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate(`/addusername/${response.data.userId}`);
        return;
      }
      toast({
        title: "Login successful.",
        description: "You are being redirected to the posts page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/posts");
    } catch (error) {
      console.error("Github login error: ", error);
      toast({
        title: "Login failed.",
        description: error.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/user/login",
        { email, password },
        { withCredentials: true }
      );
      setLoading(false);
      toast({
        title: "Login successful.",
        description: "You are being redirected to the posts page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/posts");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Login failed.",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Container maxW="md" bg="white" boxShadow="md" p={6} rounded="md">
        <Stack spacing={4}>
          <Heading as="h1" size="lg" textAlign="center">
            Login
          </Heading>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <Button colorScheme="teal" isLoading={loading} onClick={handleLogin}>
            Login
          </Button>
          <Button colorScheme="red" onClick={handleGoogleLogin}>
            Login with Google
          </Button>
        </Stack>
      </Container>
    </Flex>
  );
};

export default LoginPage;
