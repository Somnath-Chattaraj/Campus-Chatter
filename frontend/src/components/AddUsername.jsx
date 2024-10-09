import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUsername = () => {
  const [formData, setFormData] = useState({
    username: "",
    id: "",
  });
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setFormData((prev) => ({
        ...prev,
        id: id,
      }));
    }
  }, [id]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/user/addusername", formData, {
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
      navigate("/login");
    } catch (err) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Error adding username.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="100%" maxW="500px" mx="auto" mt="5">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              border="2px solid"
              borderColor="gray.300"
              padding={4}
              borderRadius="md"
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px #3182CE",
              }}
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

export default AddUsername;
