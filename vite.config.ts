import { defineConfig } from "vite"


export default defineConfig(() => {
  return {
    define: {
      VITE_WALLET_CONNECT_PROJECT_ID: process.env.VITE_WALLET_CONNECT_PROJECT_ID,
      VITE_BACKEND_API_URL: process.env.VITE_BACKEND_API_URL,
      VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID
    },
  };
});