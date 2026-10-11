import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    target: 'es2020',
    sourcemap: false,
    assetsInlineLimit: 4096, // Inline only small assets (< 4KB)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react'
            }
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'vendor-animation'
            }
            if (id.includes('canvas-confetti') || id.includes('react-confetti') || id.includes('react-qr-code') || id.includes('browser-image-compression')) {
              return 'vendor-ui-tools'
            }
          }
        },
      },
    },
  },
})
