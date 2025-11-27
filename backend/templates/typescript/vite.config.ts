import { defineConfig } from "vite";

export default defineConfig({
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
