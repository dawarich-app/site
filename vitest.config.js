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
      '@docusaurus/Translate': fileURLToPath(new URL('./src/test/mocks/Translate.js', import.meta.url)),
      '@docusaurus/Interpolate': fileURLToPath(
        new URL('./src/test/mocks/Interpolate.js', import.meta.url),
      ),
      '@docusaurus/Link': fileURLToPath(new URL('./src/test/mocks/Link.js', import.meta.url)),
      '@docusaurus/useDocusaurusContext': fileURLToPath(
        new URL('./src/test/mocks/useDocusaurusContext.js', import.meta.url),
      ),
      '@locale-content': fileURLToPath(new URL('./src/i18n/content/en', import.meta.url)),
      '@docusaurus/theme-common': fileURLToPath(
        new URL('./src/test/mocks/themeCommon.js', import.meta.url),
      ),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /(src|test)\/.*\.(js|jsx|ts|tsx)$/,
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
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'scripts/**/*.{test,spec}.{js,mjs}',
      'plugins/**/*.{test,spec}.js',
      'test/**/*.{test,spec}.{js,jsx}',
    ],
  },
});
