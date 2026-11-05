import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // En GitHub Pages el sitio queda en fiorers.dev/zobro/ (el nombre del repo), así que en
  // build usamos esa subruta como base; en desarrollo seguimos en la raíz.
  base: command === 'build' ? '/zobro/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png', 'splash/*.png'],
      manifest: {
        name: 'Zobro',
        short_name: 'Zobro',
        description:
          'Guía visual para repartir tus ingresos por sobres, según tus propias prioridades.',
        lang: 'es',
        display: 'standalone',
        orientation: 'portrait',
        // Sin background_color ni theme_color a propósito (igual que Teleo): así
        // Chrome en Android usa los suyos (claro u oscuro según el modo del
        // teléfono) en la apertura y en la barra de abajo, que salen del
        // manifest y no se pueden cambiar con código. Van en undefined y no
        // simplemente borrados porque vite-plugin-pwa rellena los que faltan
        // con sus valores por defecto (#ffffff y un verde #42b883); con
        // undefined quedan fuera del manifest.
        background_color: undefined,
        theme_color: undefined,
        start_url: '.',
        scope: '.',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
}))
