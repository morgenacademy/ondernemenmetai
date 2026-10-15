import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // content/ en starter-repo/ staan naast platform/ en worden met import.meta.glob ingelezen
  server: { fs: { allow: ['..'] } },
  test: { environment: 'node', include: ['src/**/*.test.{ts,tsx}'] },
});
