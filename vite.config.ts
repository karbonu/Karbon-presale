import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    VITE_WALLET_CONNECT_PROJECT_ID: process.env.VITE_WALLET_CONNECT_PROJECT_ID,
    VITE_BACKEND_API_URL: process.env.VITE_BACKEND_API_URL,
    VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID
  },
})
