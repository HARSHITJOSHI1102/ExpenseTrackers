import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../backend/frontend/dist'), // so backend can serve it
    emptyOutDir: true
  }
});
