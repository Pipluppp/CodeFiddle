import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
    https: {
      key: '/certs/privkey.pem',
      cert: '/certs/fullchain.pem'
    },
    hmr: {
      host: "codebox.tutorialsdojo.com",
      protocol: "wss"
    }
  },
  preview: {
    host: true,
    port: 5173,
    https: {
      key: '/certs/privkey.pem',
      cert: '/certs/fullchain.pem'
    }
  },
});
