import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    https: {
      key: "/certs/privkey.pem",
      cert: "/certs/fullchain.pem",
    },
    hmr: {
      host: "codebox.tutorialsdojo.com",
      protocol: "wss",
    },
  },
  preview: {
    host: true,
    port: 5173,
    https: {
      key: "/certs/privkey.pem",
      cert: "/certs/fullchain.pem",
    },
  },
});
