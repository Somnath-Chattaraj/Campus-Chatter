import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  RadioGroup,
  Radio,
  Stack,
  VStack,
  List,
  ListItem,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import { set, z } from "zod";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { collegeNames } from "./data/collegeNames";
import { courseNames } from "./data/courseName";
import { location } from "./data/location";

import Autosuggest from "react-autosuggest";
import Navbar from "./MainNavbar";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    collegeName: "",
    courseName: "",
    isOnline: false, // Default value as boolean
    location: "",
  });

  const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email address " }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long " }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long. " })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character ",
        }
      ),
    collegeName: z.string().optional(),
    courseName: z.string().optional(),
    isOnline: z.boolean(),
    location: z.string().optional(),
  });

  const navigate = useNavigate();
  const toast = useToast();

  const [suggestionsCollege, setSuggestionsCollege] = useState([]);
  const [suggestionsCourse, setSuggestionsCourse] = useState([]);
  const [suggestionsLocation, setSuggestionsLocation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getSuggestionsCollege = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : collegeNames.filter((name) => name.toLowerCase().includes(inputValue));
  };

  const getSuggestionsCourse = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : courseNames.filter((name) => name.toLowerCase().includes(inputValue));
  };

  const getSuggestionsLocation = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : location.filter((name) => name.toLowerCase().includes(inputValue));
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => (
    <ListItem
      p={2}
      borderBottom="1px solid"
      borderColor="gray.600"
      cursor="pointer"
      _hover={{ backgroundColor: "gray.700" }}
      bg="gray.800"
    >
      <Flex align="center">
        <Box>
          <Text fontWeight="bold" color="white">
            {" "}
            {suggestion}
          </Text>
        </Box>
      </Flex>
    </ListItem>
  );

  const onSuggestionsFetchRequestedCollege = ({ value }) => {
    setSuggestionsCollege(getSuggestionsCollege(value));
  };

  const onSuggestionsFetchRequestedCourse = ({ value }) => {
    setSuggestionsCourse(getSuggestionsCourse(value));
  };

  const onSuggestionsFetchRequestedLocation = ({ value }) => {
    setSuggestionsLocation(getSuggestionsLocation(value));
  };

  const onSuggestionsClearRequestedCollege = () => {
    setSuggestionsCollege([]);
  };

  const onSuggestionsClearRequestedCourse = () => {
    setSuggestionsCourse([]);
  };

  const onSuggestionsClearRequestedLocation = () => {
    setSuggestionsLocation([]);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRadioChange = (value) => {
    setFormData({
      ...formData,
      isOnline: value === "true",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      registerSchema.parse(formData);
      setErrors({});
      const response = await axios.post("/api/user/register", formData, {
        withCredentials: true,
      });
      toast({
        title: "Account created.",
        description: "Please check your email to verify your account.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      navigate("/login");
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.formErrors.fieldErrors);
      }
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <Box w="100%" maxW="500px" mx="auto" mt="5">
      <FormLabel fontSize="5xl" textAlign="center">
        Register
      </FormLabel>
      {/* <Navbar btnName="Login"/> */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <Box color="red">{errors.email}</Box>}
          </FormControl>

          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
            {errors.username && <Box color="red">{errors.username}</Box>}
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <Box color="red">{errors.password}</Box>}
          </FormControl>

          <FormControl id="collegeName">
            <FormLabel>College Name</FormLabel>
            <Autosuggest
              suggestions={suggestionsCollege}
              onSuggestionsFetchRequested={onSuggestionsFetchRequestedCollege}
              onSuggestionsClearRequested={onSuggestionsClearRequestedCollege}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={{
                placeholder: "Search colleges...",
                value: formData.collegeName,
                onChange: (_, { newValue }) =>
                  setFormData({ ...formData, collegeName: newValue }),
              }}
              renderInputComponent={(inputProps) => (
                <Input
                  {...inputProps}
                  border="2px solid"
                  borderColor="gray.300"
                  padding={4}
                  borderRadius="md"
                  mb={3}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px #3182CE",
                  }}
                />
              )}
              renderSuggestionsContainer={({ containerProps, children }) => (
                <Box
                  {...containerProps}
                  bg="white"
                  boxShadow="md"
                  borderRadius="md"
                  mt={2}
                  maxHeight="300px"
                  overflowY="auto"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <List>{children}</List>
                </Box>
              )}
            />
          </FormControl>

          <FormControl id="courseName">
            <FormLabel>Course Name</FormLabel>
            <Autosuggest
              suggestions={suggestionsCourse}
              onSuggestionsFetchRequested={onSuggestionsFetchRequestedCourse}
              onSuggestionsClearRequested={onSuggestionsClearRequestedCourse}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={{
                placeholder: "Search courses...",
                value: formData.courseName,
                onChange: (_, { newValue }) =>
                  setFormData({ ...formData, courseName: newValue }),
              }}
              renderInputComponent={(inputProps) => (
                <Input
                  {...inputProps}
                  border="2px solid"
                  borderColor="gray.300"
                  padding={4}
                  borderRadius="md"
                  mb={3}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px #3182CE",
                  }}
                />
              )}
              renderSuggestionsContainer={({ containerProps, children }) => (
                <Box
                  {...containerProps}
                  bg="white"
                  boxShadow="md"
                  borderRadius="md"
                  mt={2}
                  maxHeight="300px"
                  overflowY="auto"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <List>{children}</List>
                </Box>
              )}
            />
          </FormControl>

          <FormControl id="location">
            <FormLabel>Location</FormLabel>
            <Autosuggest
              suggestions={suggestionsLocation}
              onSuggestionsFetchRequested={onSuggestionsFetchRequestedLocation}
              onSuggestionsClearRequested={onSuggestionsClearRequestedLocation}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={{
                placeholder: "Search location...",
                value: formData.location,
                onChange: (_, { newValue }) =>
                  setFormData({ ...formData, location: newValue }),
              }}
              renderInputComponent={(inputProps) => (
                <Input
                  {...inputProps}
                  border="2px solid"
                  borderColor="gray.300"
                  padding={4}
                  borderRadius="md"
                  mb={3}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px #3182CE",
                  }}
                />
              )}
              renderSuggestionsContainer={({ containerProps, children }) => (
                <Box
                  {...containerProps}
                  bg="white"
                  boxShadow="md"
                  borderRadius="md"
                  mt={2}
                  maxHeight="300px"
                  overflowY="auto"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <List>{children}</List>
                </Box>
              )}
            />
          </FormControl>

          <FormControl as="fieldset" id="isOnline">
            <FormLabel as="legend">Is Online?</FormLabel>
            <RadioGroup
              name="isOnline"
              value={formData.isOnline.toString()}
              onChange={handleRadioChange}
            >
              <Stack direction="row">
                <Radio value="true">Yes</Radio>
                <Radio value="false">No</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterForm;
