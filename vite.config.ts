import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleAiTutorRequest } from './src/server/aiTutorHandler.ts';
import { handleExtractDocRequest } from './src/server/extractDocHandler.ts';

const aiTutorPlugin = (): Plugin => ({
  name: 'ai-tutor-api-server',
  configureServer(server) {
    server.middlewares.use('/api/ai-tutor', (req, res) => {
      handleAiTutorRequest(req, res).catch((err) => {
        console.error('[Vidya AI Middleware Error]:', err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal Server Error handling AI Tutor request.' }));
        }
      });
    });

    server.middlewares.use('/api/extract-doc', (req, res) => {
      handleExtractDocRequest(req, res).catch((err) => {
        console.error('[SnapStudy Middleware Error]:', err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal Server Error handling Document Extraction request.' }));
        }
      });
    });
  }
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), aiTutorPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

