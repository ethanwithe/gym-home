import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: 'https://api-gateway-production-be01.up.railway.app',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      sourcemap: false, // ⚡ Desactiva source maps con eval en producción
      minify: 'esbuild', // asegura JS seguro sin eval
      rollupOptions: {
        output: {
          manualChunks: undefined, // puedes personalizar si quieres code splitting
        },
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
    },
  }
})
