import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  VStack,
  useToast,
  Flex,
  Input,
} from "@chakra-ui/react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import VideoCall from "./VideoCall";
import { useUser } from "../hook/useUser";
import axios from "axios";
import "../styles/loader.css";
// import { useNavigate } from "react-router-dom";

const StartVideoCall = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { userDetails, loadingUser } = useUser();

  const [isLoading, setIsLoading] = useState(loadingUser);
  const [roomUrl, setRoomUrl] = useState(""); // URL for the created room
  const [joinRoomUrl, setJoinRoomUrl] = useState(""); // URL for joining a room
  const buttonRef = useRef();

  useEffect(() => {
    if (loadingUser) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      if (!userDetails) {
        toast({
          title: "Please sign in first",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login");
      }
    }
  }, [loadingUser, userDetails]);

  const createRoom = async () => {
    try {
      const response = await axios.post("/api/video/createroom");
      if (response.status == 205) {
        navigate(`/video/${userDetails.username}`);
        return;
      }
      setRoomUrl(response.data.url);
      setJoinRoomUrl("");
      navigate(`/video/${response.data.url.split("/").pop()}`);
    } catch (error) {
      console.error("Failed to create room", error);
      toast({
        title: "Error creating room",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUrlChange = (e) => {
    setJoinRoomUrl(e.target.value);
  };

  const handleJoinRoom = () => {
    if (joinRoomUrl) {
      setRoomUrl(joinRoomUrl);
      setJoinRoomUrl("");
      navigate(`/video/${joinRoomUrl.split("/").pop()}`);
    } else {
      toast({
        title: "Please enter a valid room URL",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      gsap.from(buttonRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: "bounce",
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="black">
        <div className="loader"></div>
      </Flex>
    );
  }

  return (
    <Center height="100vh" bgGradient="linear(to-r, teal.500, blue.500)">
      <VStack spacing={8}>
        <Heading color="white" size="2xl">
          {roomUrl ? "Join the Video Call" : "Ready to Start a Video Call?"}
        </Heading>
        <Button
          ref={buttonRef}
          colorScheme="teal"
          size="lg"
          onClick={createRoom}
        >
          Start Video Call
        </Button>
        <Input
          placeholder="Enter Room URL"
          value={joinRoomUrl}
          onChange={handleUrlChange} // Use handleUrlChange to update state
        />
        <Button
          colorScheme="teal"
          size="lg"
          onClick={handleJoinRoom} // Call handleJoinRoom when joining
        >
          Join Video Call
        </Button>
      </VStack>
    </Center>
  );
};

export default StartVideoCall;
