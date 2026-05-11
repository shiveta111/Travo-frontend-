import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: any) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ command }) => ({
  // Local dev (`vite`) serves from "/", production build (`vite build`) is
  // hosted at https://dev.ekarigar.com/travo/ so assets must be prefixed.
  base: command === 'build' ? '/travo/' : '/',

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          // If target is localhost, don't add the /travo/backend prefix
          const target = 'http://localhost:5000';
          return target.includes('localhost') ? path : path.replace(/^\/api/, '/travo/backend/api');
        },
        headers: {
          Origin: 'http://localhost:3000',
        },
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          const target = 'http://localhost:5000';
          return target.includes('localhost') ? path : path.replace(/^\/uploads/, '/travo/backend/uploads');
        },
        headers: {
          Origin: 'http://localhost:3000',
        },
      },
    },
  },

  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),

  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
}))
