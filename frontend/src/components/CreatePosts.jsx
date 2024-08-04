import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";

const CreatePost = ({ communities, onSubmit }) => {
  const [postContent, setPostContent] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");

  const handlePostChange = (e) => setPostContent(e.target.value);
  const handleCommunityChange = (e) => setSelectedCommunity(e.target.value);

  const handleSubmit = () => {
    if (postContent && selectedCommunity) {
      onSubmit({ content: postContent, community: selectedCommunity });
      setPostContent("");
      setSelectedCommunity("");
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" width="100%">
      <VStack spacing={4} align="stretch">
        <FormControl id="community">
          <FormLabel>Select Community</FormLabel>
          <Select
            placeholder="Select community"
            value={selectedCommunity}
            onChange={handleCommunityChange}
          >
            {communities.map((community) => (
              <option key={community} value={community}>
                {community}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="post">
          <FormLabel>Create Post</FormLabel>
          <Textarea
            value={postContent}
            onChange={handlePostChange}
            placeholder="Write your post here..."
          />
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="blue">
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default CreatePost;
