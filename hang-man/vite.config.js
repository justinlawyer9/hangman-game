import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/dynamodb': {
        target: 'http://dynamodb-local:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dynamodb/, '')
      }
    }
  }
})