import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@models': path.resolve(__dirname, './src/shared/models'),
      '@enums': path.resolve(__dirname, './src/shared/enums'),
      '@constants': path.resolve(__dirname, './src/shared/constants'),
      '@hooks': path.resolve(__dirname, './src/core/hooks'),
      '@providers': path.resolve(__dirname, './src/core/providers'),
    },
  },
});
