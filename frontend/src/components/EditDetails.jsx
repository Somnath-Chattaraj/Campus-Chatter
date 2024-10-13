import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Flex,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hook/useUser";
import { InfinitySpin } from "react-loader-spinner";

const EditDetailsSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  pic: z.string().optional(),
});

const EditDetails = () => {
  const [formData, setFormData] = useState({
    username: "",
    pic: "",
  });
  const { userDetails, loadingUser } = useUser();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, pic: e.target.files[0] });
  };

  useEffect(() => {
    if (loadingUser) return;

    if (!userDetails) {
      toast({
        title: "Error",
        description: "You need to be logged in to access this page.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } else if (userDetails.username === null) {
      navigate(`/addusername/${userDetails.user_id}`);
    }
  }, [userDetails, loadingUser, navigate, toast]);

  useEffect(() => {
    if (userDetails) {
      setFormData({
        username: userDetails.username || "",
        pic: "",
      });
    }
  }, [userDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let picUrl = formData.pic;

      if (
        formData.pic &&
        (formData.pic.type === "image/jpeg" ||
          formData.pic.type === "image/png")
      ) {
        const data = new FormData();
        data.append("file", formData.pic);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "piyushproj");

        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/piyushproj/image/upload",
          {
            method: "post",
            body: data,
          }
        );
        const uploadData = await uploadResponse.json();
        picUrl = uploadData.url;
      }

      const updatedFormData = {
        ...formData,
        pic: picUrl,
      };

      EditDetailsSchema.parse(updatedFormData);
      setError({});

      const response = await axios.post("/api/user/update", updatedFormData, {
        withCredentials: true,
      });

      setLoading(false);
      toast({
        title: "Success",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/posts");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.formErrors.fieldErrors);
      }
      setLoading(false);
      toast({
        title: "Error",
        description: "Error updating details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loadingUser) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="black">
        <InfinitySpin color="#3182CE" size={80} />
      </Flex>
    );
  }

  return (
    <Box w="100%" maxW="500px" mx="auto" mt="5">
      <Box textAlign="center" mb={6}>
        <Avatar size="xl" src={userDetails.pic} mb={2} />
        <Text fontSize="lg">{userDetails?.username || "Your Username"}</Text>
      </Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="username">
            <FormLabel>Username (Optional)</FormLabel>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter new username"
              border="2px solid"
              borderColor="gray.300"
              padding={4}
              borderRadius="md"
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
            />
            {error.username && <Box color="red.500">{error.username}</Box>}
          </FormControl>

          <FormControl id="pic">
            <FormLabel>Upload Profile Picture</FormLabel>
            <Input
              type="file"
              name="pic"
              accept="image/*"
              onChange={handleFileChange}
              padding={2}
              borderWidth={2}
              borderColor="gray.300"
              borderRadius="md"
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
              height="auto"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText="Submitting"
          >
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EditDetails;
