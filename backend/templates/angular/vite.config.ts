// @ts-nocheck
import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";

const hmrHost = process.env.VITE_HMR_HOST || "localhost";

export default defineConfig({
  plugins: [angular()],
  server: {
    host: true,
    port: 4200,
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
    port: 4200,
    https: {
      key: "/certs/privkey.pem",
      cert: "/certs/fullchain.pem",
    },
  },
});
