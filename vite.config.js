import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/wind-farm-parameter-explorer/',
  plugins: [react()],
  server: {
    port: 3001,
  },
})
