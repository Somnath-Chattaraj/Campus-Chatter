import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostBox from "./components/Posts";
import ProfilePage from "./components/ProfilePage";
import ChatRoom from "./components/ChatRoom";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PostBox />} />
          <Route path="/profile/:userId" component={ProfilePage} />
          <Route path="/chat/:roomId" component={ChatRoom} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
