import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ include: /\.(js|jsx|ts|tsx)$/ })],
  resolve: {
    alias: {
      '@site': fileURLToPath(new URL('.', import.meta.url)),
      '@theme/Layout': fileURLToPath(new URL('./src/test/mocks/Layout.js', import.meta.url)),
      '@docusaurus/Head': fileURLToPath(new URL('./src/test/mocks/Head.js', import.meta.url)),
      '@docusaurus/BrowserOnly': fileURLToPath(
        new URL('./src/test/mocks/BrowserOnly.js', import.meta.url),
      ),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.(js|jsx|ts|tsx)$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
});
