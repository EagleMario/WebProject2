import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/User': 'http://localhost:3500',
      '/Class': 'http://localhost:3500',
      '/Exam': 'http://localhost:3500',
      '/Grades': 'http://localhost:3500',
      '/DashBoard': 'http://localhost:3500',
      '/lectures': 'http://localhost:3500',
      '/Notification': 'http://localhost:3500',
      '/ai': 'http://localhost:3500',
      '/socket.io': {
        target: 'ws://localhost:3500',
        ws: true
      }
    }
  }
})
