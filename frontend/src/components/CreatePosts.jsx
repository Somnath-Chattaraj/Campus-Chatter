import React, { useState,useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box, Button, FormControl, FormLabel, Select, VStack, Input,Spinner } from "@chakra-ui/react";

const modules = {
  toolbar: {
    container: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"], 
      ["clean"],
    ],
    handlers: {
      image: async function () {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          const file = input.files[0];
          if (file) {
            const imageUrl = await handleImageUpload(file);
            const quill = this.quill;
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", imageUrl);
          }
        };
      },
    },
  },
};

const CreatePost = ({ communities, onSubmit }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [loading, setLoading] = useState(false);
  const quillRef = React.useRef(null);

  const handleTitleChange = (e) => setPostTitle(e.target.value);
  const handleCommunityChange = (e) => setSelectedCommunity(e.target.value);

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
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
    return uploadData.url; 
  };

  const handlePaste = async (e) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          setLoading(true);
          try {
            const imageUrl = await handleImageUpload(file);
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", imageUrl);
          } catch (error) {
            console.error("Error uploading image: ", error);
          } finally {
            setLoading(false);
          }
        }
      }
    }
  };

  useEffect(() => {
    const quill = quillRef.current.getEditor();
    quill.root.addEventListener("paste", handlePaste);
    return () => {
      quill.root.removeEventListener("paste", handlePaste);
    };
  }, []);
  const handleSubmit = () => {
    if (postTitle && postContent && selectedCommunity) {
      onSubmit({
        title: postTitle,
        content: postContent,
        community: selectedCommunity,
      });
      setPostTitle("");
      setPostContent("");
      setSelectedCommunity("");
    }
  };

  const handleEditorChange = (content) => {
    setPostContent(content);
  };

  return (
    <VStack spacing={4} align="stretch" width="100%">
      <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="md" pb={20}>
        <FormControl id="community">
          <FormLabel>Select Community</FormLabel>
          <Select
            placeholder="Select community"
            value={selectedCommunity}
            onChange={handleCommunityChange}
          >
            {communities.map((community) => (
              <option key={community.college_id} value={community.college_id}>
                {community.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="title">
          <FormLabel>Post Title</FormLabel>
          <Input
            value={postTitle}
            onChange={handleTitleChange}
            placeholder="Enter post title"
          />
        </FormControl>

        <FormControl id="post">
          <FormLabel>Create Post</FormLabel>
          <Box position="relative">
            <ReactQuill
            ref={quillRef}
              value={postContent}
              onChange={handleEditorChange}
              onPaste={handlePaste} 
              modules={modules} 
              style={{ height: "250px" }} 
              placeholder="Write your post here..."
            />
            <Button 
              onClick={handleSubmit} 
              colorScheme="blue" 
              size="sm" 
              position="absolute" 
              right="10px"
              isDisabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Submit"}
            </Button>
          </Box>
        </FormControl>
      </Box>
    </VStack>
  );
};

export default CreatePost;
