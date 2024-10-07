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
} from "@chakra-ui/react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { collegeNames } from "./data/collegeNames";
import { courseNames } from "./data/courseName";
import { location } from "./data/location";

import Autosuggest from "react-autosuggest";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    collegeName: "",
    courseName: "",
    isOnline: false, // Default value as boolean
    location: "",
  });

  const navigate = useNavigate();

  const [suggestionsCollege, setSuggestionsCollege] = useState([]);
  const [suggestionsCourse, setSuggestionsCourse] = useState([]);
  const [suggestionsLocation, setSuggestionsLocation] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post("/user/register", formData, {
        withCredentials: true,
      });
      setLoading(false);
      navigate("/login");
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <Box w="100%" maxW="500px" mx="auto" mt="5">
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
          </FormControl>

          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
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
          </FormControl>

          <FormControl id="collegeName" isRequired>
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

          <FormControl id="courseName" isRequired>
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

          <FormControl id="location" isRequired>
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

          <FormControl as="fieldset" id="isOnline" isRequired>
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
