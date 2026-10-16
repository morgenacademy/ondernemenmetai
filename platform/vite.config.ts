import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // content/ en starter-repo/ staan naast platform/ en worden met import.meta.glob ingelezen
  server: { fs: { allow: ['..'] } },
  // css.include: anders geeft Vitest voor styles.css?raw een lege string (zie styles.test.ts)
  test: { environment: 'node', include: ['src/**/*.test.{ts,tsx}'], css: { include: [/styles\.css/] } },
});
