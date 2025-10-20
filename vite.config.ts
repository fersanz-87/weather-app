import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // Ensure the entry point is correctly set
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})


