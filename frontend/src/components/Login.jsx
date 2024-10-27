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
import { FcGoogle } from "react-icons/fc"; // Google icon
import { FaGithub } from "react-icons/fa"; // GitHub icon
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, githubProvider } from "../firebase.js";
import { signInWithPopup } from "firebase/auth";
import { InfinitySpin } from "react-loader-spinner";
import { set } from "zod";
import "../styles/login.css";
import "../styles/loader.css"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const response = await axios.post(
        "/api/user/google",
        {
          email: user.email,
          displayName: user.displayName,
        },
        { withCredentials: true }
      );
      // console.log(response.data.isCollegeEmail);
      if (response.data.isCollegeEmail === true) {
        toast({
          title: "Signup successful.",
          description: "Add college details to continue.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        navigate(`/addDetails/${response.data.userId}`);
        return;
      }
      if (!response.data.username) {
        toast({
          title: "Signup successful.",
          description: "Add username to continue.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        navigate(`/addusername/${response.data.userId}`);
        return;
      }
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
        "/api/user/github",
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
          description: "Add username to continue.",
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

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="black">
        <div class="loader"></div>
      </Flex>
    );
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/user/login",
        { email, password },
        { withCredentials: true }
      );
      setLoading(false);
      if (response.status == 201) {
        toast({
          title: "Email not verified.",
          description: "Please check your email for verification.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
      toast({
        title: "Login successful.",
        description: "You are being redirected to the posts page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/posts");
    }
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
    <Flex minH="100vh" align="center" justify="center" bg="black">
      {loading ? (
        <Flex align="center" justify="center">
          <div class="loader"></div>
        </Flex>
      ) : (
        <form className="form">
          <p>
            Welcome,<span>sign in to continue</span>
          </p>
          <button type="button" className="oauthButton" onClick={handleGoogleLogin}>
            <FcGoogle className="icon" />
            Continue with Google
          </button>
          <button type="button" className="oauthButton" onClick={handleGithubLogin}>
            <FaGithub className="icon" />
            Continue with Github
          </button>
          <div className="separator">
            <div></div>
            <span>OR</span>
            <div></div>
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button type="button" className="oauthButton" onClick={handleLogin}>
            Continue
          </button>
          <Link to="/forgetPassword" className="forgot-password">
            Forgot Password?
          </Link>
        </form>
      )}
    </Flex>
  );
};


export default LoginPage;
