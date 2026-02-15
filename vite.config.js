import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
const dynamicRoutes=[
  '/browse',
  '/dashboard',
  '/my-uploads',
  '/upload',
  '/signin',
  '/signup',
]
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    sitemap({
      hostname: 'https://tcematerials.tech',
      dynamicRoutes: dynamicRoutes,
      generateRobotsTxt: true,
    }),
  ],
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
})
