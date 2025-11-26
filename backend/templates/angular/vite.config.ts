// @ts-nocheck
import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";

export default defineConfig({
  plugins: [angular()],
  server: {
    host: true,
    port: 4200,
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
    port: 4200,
    https: {
      key: '/certs/privkey.pem',
      cert: '/certs/fullchain.pem'
    }
  },
});
