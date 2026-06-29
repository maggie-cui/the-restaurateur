import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@restaurateur/game-engine': path.resolve(
        __dirname,
        '../../packages/game-engine/src/index.ts',
      ),
    },
  },
});
