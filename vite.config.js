import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'NearChat',
      short_name: 'NearChat',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#317EFB',
      icons: [
        {
          src: 'images/web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'images/web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })
  ],
})
