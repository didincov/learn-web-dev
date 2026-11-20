import { defineConfig } from 'vite';
import { mockServer } from './server/server.js';

export default defineConfig({
  plugins: [mockServer()],
  server: { port: 3000 }
});
