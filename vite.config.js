import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    historyApiFallback: true, // Fixes 404 on refresh in dev
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
