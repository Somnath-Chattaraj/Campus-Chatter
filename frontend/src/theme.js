import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark", // Enforce dark mode
    useSystemColorMode: false, // Disable system color mode
  },
  styles: {
    global: {
      // Global styles to ensure the entire app is dark
      body: {
        bg: "gray.900", // Dark background for the body
        color: "whiteAlpha.900", // White text
      },
    },
  },
});

export default theme;
