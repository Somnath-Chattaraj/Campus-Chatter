import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react";
import PostBox from "./components/Posts";
import Room from "./components/Room";

function App() {
  return (
    <ChakraProvider>
      <LiveblocksProvider publicApiKey={import.meta.env.VITE_API_KEY}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PostBox />} />
            <Route
              path="/room"
              element={
                <RoomProvider id="my-room">
                  <Room />
                </RoomProvider>
              }
            />
          </Routes>
        </BrowserRouter>
      </LiveblocksProvider>
    </ChakraProvider>
  );
}

export default App;
