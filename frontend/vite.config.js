import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { BACKEND_URL } from "./src/config";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    proxy: {
      "/api": {
        target: BACKEND_URL, // Set target to http://localhost:3000/api
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: remove '/api' from the path
      },
    },
  },
});
