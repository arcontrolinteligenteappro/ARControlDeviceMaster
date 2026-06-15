import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@shared': resolve('src/shared'),
      },
    },
    build: {
      outDir: 'dist/main',
      rollupOptions: {
        // Mantenemos sus dependencias externas originales a salvo
        external: ['express', 'socket.io'],
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/preload',
    },
  },
  renderer: {
    resolve: {
      alias: {
        // Mantenemos ambos alias para que no se rompa ningún import anterior
        '@': resolve('src/renderer/src'),
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [react()],
    build: {
      outDir: 'dist/renderer',
    },
  },
});
