import React, { useState } from "react";
import axios from "axios";
import Autosuggest from "react-autosuggest";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Input,
  Button,
  List,
  ListItem,
  Avatar,
  Flex,
  Text,
} from "@chakra-ui/react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const fetchSuggestions = async (value) => {
    try {
      const response = await axios.post(
        "/api/post/search",
        { query: value },
        { withCredentials: true }
      );
      setSuggestions(response.data.posts);
    } catch (err) {
      console.error("Error fetching suggestions", err);
    }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    if (value.length >= 1) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.title;

  const renderSuggestion = (suggestion) => (
    <ListItem
      p={2}
      borderBottom="1px solid"
      borderColor="gray.200"
      cursor="pointer"
      _hover={{ backgroundColor: "gray.100" }}
      onClick={() => navigate(`/posts/${suggestion.post_id}`)}
    >
      <Flex align="center">
        <Avatar size="sm" mr={3} />
        <Box>
          <Text fontWeight="bold">{suggestion.title}</Text>
          <Text fontSize="sm" color="gray.500">
            {suggestion.content.slice(0, 50)}...
          </Text>
        </Box>
      </Flex>
    </ListItem>
  );

  const handleSearchSubmit = async () => {
    try {
      const response = await axios.post(
        "/api/post/search",
        { query: searchTerm },
        { withCredentials: true }
      );
      navigate("/posts", { state: { posts: response.data.posts } });
    } catch (err) {
      console.error("Error searching", err);
    }
  };

  return (
    <Box mb={4} mt={10} width="100%" maxW="600px" mx="auto" position="relative">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          placeholder: "Search posts...",
          value: searchTerm,
          onChange: (_, { newValue }) => setSearchTerm(newValue),
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
      {/* <Button onClick={handleSearchSubmit} colorScheme="blue" width="100%">
        Search
      </Button> */}
    </Box>
  );
};

export default SearchBar;
