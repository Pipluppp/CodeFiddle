import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true,
      },
    }),
  ],
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
})
