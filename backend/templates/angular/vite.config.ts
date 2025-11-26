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
