import React, { useState } from "react";
import { Box, Button, Textarea, VStack } from "@chakra-ui/react";
import axios from "axios";

const CreateComment = ({ postId, onCommentAdded }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (comment.trim() === "") return;
    setLoading(true);
    try {
      await axios.post(
        "/post/comment",
        { content: comment, postId: postId },
        { withCredentials: true }
      );
      setComment("");
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating comment:", error);
      setLoading(false);
    }
  };

  return (
    <VStack spacing={3} align="stretch" width="100%">
      <Textarea
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        colorScheme="teal"
        size="sm"
        onClick={handleSubmit}
        isLoading={loading}
        marginBottom={2}
        padding={4}
      >
        Post Comment
      </Button>
    </VStack>
  );
};

export default CreateComment;
