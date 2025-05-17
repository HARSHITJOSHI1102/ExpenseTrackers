import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/', // Ensures routing works properly in production
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../backend/frontend/dist'), // Adjust this to where backend serves from
    emptyOutDir: true,
  },
});
