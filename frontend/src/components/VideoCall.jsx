import DailyIframe from "@daily-co/daily-js";
import { useEffect, useRef, useState } from "react";
import { Box, useToast, Flex } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../hook/useUser";
import axios from "axios";
import "../styles/loader.css";

const VideoCall = () => {
  const videoRef = useRef();
  const callFrame = useRef();
  const { id } = useParams();
  const navigate = useNavigate();
  const roomUrl = "https://campusify.daily.co/" + id;
  const { userDetails, loadingUser } = useUser();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

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
  }, [loadingUser, userDetails, navigate, toast]);

  const username = userDetails?.username;

  useEffect(() => {
    if (!isLoading && username) {
      callFrame.current = DailyIframe.createFrame(videoRef.current, {
        showLeaveButton: true,
        iframeStyle: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "0",
        },
      });
      const handleLeave = async () => {
        const videoId = roomUrl.split("/").pop();
        try {
          const response = await axios.delete("/api/video/deleteroom", {
            data: { video_id: videoId },
          });
          console.log(response.data.message);
        } catch (error) {
          console.error("Failed to delete room:", error);
        }
      };
      callFrame.current.on("left-meeting", handleLeave);

      //   console.log(username, roomUrl);
      callFrame.current.join({ url: roomUrl, userName: username });

      return () => {
        callFrame.current.leave();
        callFrame.current.destroy();
      };
    }
  }, [roomUrl, username, isLoading]);

  if (isLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="black">
        <div className="loader"></div>
      </Flex>
    );
  }

  return (
    <Box
      ref={videoRef}
      width="100vw"
      height="100vh"
      position="absolute"
      top="0"
      left="0"
      bg="black"
    />
  );
};

export default VideoCall;
