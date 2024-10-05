import React, { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import Mainrouter from "./components/routes/mainroute";
import theme from "./theme";

const App = () => {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [roomId, setRoomId] = useState("");
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={Mainrouter} />
    </ChakraProvider>
  );
};

export default App;
