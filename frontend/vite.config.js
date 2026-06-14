import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/User': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/User/, '/api/users')
      },
      '/Class': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/Class/, '/api/classes')
      },
      '/Exam': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/Exam/, '/api/exams')
      },
      '/Grades': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/Grades/, '/api/grades')
      },
      '/DashBoard': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/DashBoard/, '/api/dashboard')
      },
      '/lectures': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/lectures/, '/api/lectures')
      },
      '/Notification': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/Notification/, '/api/notifications')
      },
      '/ai': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/ai/, '/api/ai')
      },
      '/Assignments': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/Assignments/, '/api/assignments')
      },
      '/Fees': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/Fees/, '/api/fees')
      },
      '/Salaries': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/Salaries/, '/api/salaries')
      },
      '/socket.io': {
        target: 'ws://localhost:3000',
        ws: true
      }
    }
  }
})
