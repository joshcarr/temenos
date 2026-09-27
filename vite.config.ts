import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'Temenos',
        short_name: 'Temenos',
        description: 'A Plate of journaling prompts each morning and evening, drawn from the sky.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1b1d26',
        theme_color: '#1b1d26',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Everything the Plate needs offline, including the 2.1 MB ephemeris data.
        globPatterns: ['**/*.{js,css,html,png,svg,wasm,data}', '**/*-latin-[0-9]*.woff2'],
        // The engine loads /wasm/swisseph.wasm; Vite's hashed copy in assets/ goes unused.
        globIgnores: ['**/assets/swisseph-*.wasm'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // The city list is only needed during onboarding; cache it when first used.
        runtimeCaching: [{ urlPattern: /cities\.json$/, handler: 'CacheFirst', options: { cacheName: 'cities' } }],
      },
    }),
  ],
  optimizeDeps: { exclude: ['swisseph-wasm'] },
  build: { target: 'es2022' },
});
