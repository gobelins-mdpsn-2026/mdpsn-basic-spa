import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // In dev, Vite serves the React app on :5173 and forwards /api to Express on :3000.
    proxy: { "/api": "http://localhost:3000" },
  },
});
