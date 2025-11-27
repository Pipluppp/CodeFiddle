import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const hmrHost = process.env.VITE_HMR_HOST || "localhost";

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
      host: hmrHost,
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
