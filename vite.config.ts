import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy API requests starting with `/api` to the Superset server running on port 8088
      "/api": {
        target: "http://localhost:8088",
        changeOrigin: true, // Ensures the host header is modified to match the target
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix when proxying
      },
    },
  },
});
