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
import "../styles/register.css";
import ReCAPTCHA from "react-google-recaptcha";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import collegeNames from "./data/collegeNames";
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
  const [captchaToken, setCaptchaToken] = useState(null);
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

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
      if (!captchaToken) {
        toast({
          title: "Captcha validation failed.",
          description: "Please complete the captcha.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      const response = await axios.post(
        "/api/user/register",
        { ...formData, captchaToken },
        {
          withCredentials: true,
        }
      );
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
    <Box className="container">
      {/* <Navbar btnName="Login"/> */}
      <form onSubmit={handleSubmit} className="form_area">
        <FormLabel className="title" textAlign="center">
          Register
        </FormLabel>
        <VStack spacing={4}>
          <FormControl id="email" isRequired className="form_group">
            <FormLabel className="input-label">Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form_style"
            />
            {errors.email && <Box color="red">{errors.email}</Box>}
          </FormControl>

          <FormControl id="username" isRequired className="form_group">
            <FormLabel className="input-label">Username</FormLabel>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="form_style"
            />
            {errors.username && <Box color="red">{errors.username}</Box>}
          </FormControl>

          <FormControl id="password" isRequired className="form_group">
            <FormLabel className="input-label"> Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="form_style"
            />
            {errors.password && <Box color="red">{errors.password}</Box>}
          </FormControl>

          <FormControl id="collegeName" className="form_group">
            <FormLabel className="input-label">College Name</FormLabel>
            <Box className="autosuggest_container">
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
                    className="autosuggest_input"
                  />
                )}
                renderSuggestionsContainer={({ containerProps, children }) => {
                  const hasSuggestions = React.Children.count(children) > 0;

                  return hasSuggestions ? (
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
                      className="autosuggest_list"
                    >
                      <List>{children}</List>
                    </Box>
                  ) : null;
                }}
              />
            </Box>
          </FormControl>

          <FormControl id="courseName" className="form_group">
            <FormLabel className="input-label">Course Name</FormLabel>
            <Box className="autosuggest_container">
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
                    borderColor="gray.300"
                    padding={4}
                    borderRadius="md"
                    mb={3}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px #3182CE",
                    }}
                    className="autosuggest_input"
                  />
                )}
                renderSuggestionsContainer={({ containerProps, children }) => {
                  const hasSuggestions = React.Children.count(children) > 0;

                  return hasSuggestions ? (
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
                      className="autosuggest_list"
                    >
                      <List>{children}</List>
                    </Box>
                  ) : null;
                }}
              />
            </Box>
          </FormControl>

          <FormControl id="location" className="form_group">
            <FormLabel className="input-label">Location</FormLabel>
            <Box className="autosuggest_container">
              <Autosuggest
                suggestions={suggestionsLocation}
                onSuggestionsFetchRequested={
                  onSuggestionsFetchRequestedLocation
                }
                onSuggestionsClearRequested={
                  onSuggestionsClearRequestedLocation
                }
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
                    className="autosuggest_input"
                  />
                )}
                renderSuggestionsContainer={({ containerProps, children }) => {
                  const hasSuggestions = React.Children.count(children) > 0;

                  return hasSuggestions ? (
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
                      className="autosuggest_list"
                    >
                      <List>{children}</List>
                    </Box>
                  ) : null;
                }}
              />
            </Box>
          </FormControl>

          <FormControl as="fieldset" id="isOnline" className="radio_group">
            <FormLabel as="legend" className="radio_label">
              Is Online?
            </FormLabel>
            <RadioGroup
              name="isOnline"
              value={formData.isOnline.toString()}
              onChange={handleRadioChange}
            >
              <Stack direction="row">
                <Radio value="true" className="radio_button">
                  Yes
                </Radio>
                <Radio value="false" className="radio_button">
                  No
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
          />

          <Button type="submit" colorScheme="blue" width="full" className="btn">
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterForm;
