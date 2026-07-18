import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes all asset paths relative so the built app can be opened
// directly from the file system (file://) with no server.
export default defineConfig({
  base: './',
  plugins: [react()],
})
