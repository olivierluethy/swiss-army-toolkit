import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base: './' keeps asset paths relative, and viteSingleFile inlines all JS &
// CSS into one index.html — so the build opens straight from the file system
// (file://) with no server and no cross-origin module-loading errors.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
})
