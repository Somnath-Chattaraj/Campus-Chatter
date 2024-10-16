import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    rollupOptions: {
      input: {
        client: "src/entry-client.jsx", // Client-side entry
        ssr: "src/entry-server.jsx", // Server-side entry
      },
    },
    ssr: "src/entry-server.jsx", // This tells Vite to build for SSR
    outDir: "dist-ssr", // Output folder for SSR build
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
      },
      "/ws": {
        target: process.env.VITE_WEBSOCKET_URL,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
