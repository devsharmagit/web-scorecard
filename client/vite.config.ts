import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    fs: {
      // Allow serving files from anywhere
      strict: false
    },
    // Alternative: disable file serving restrictions entirely
    // cors: true,
    // origin: 'http://localhost:5173'
  }
})
