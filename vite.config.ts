import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    hmr: {
      overlay: true,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: [/\.md$/],
  build: {
    target: 'es2020',
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'SOURCEMAP_ERROR') return;
        if (warning.message && warning.message.includes('source map')) return;
        warn(warning);
      },
      output: {
        manualChunks: (id) => {
          // Split vendor chunks for better caching
          if (id.includes('node_modules')) {
            // Large libraries get their own chunks
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'react-query';
            }
            // Note: @supabase is NOT manually chunked to avoid circular dependency issues
            // with the client initialization code
            if (id.includes('lucide-react')) {
              return 'lucide-icons';
            }
            if (id.includes('recharts')) {
              return 'recharts';
            }
            if (id.includes('fabric') || id.includes('jspdf')) {
              return 'pdf-tools';
            }
            // Other node_modules (excluding supabase which needs special handling)
            if (!id.includes('@supabase')) {
              return 'vendor';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    sourcemap: mode === 'development',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    // Enable compression
    reportCompressedSize: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'clsx',
      'tailwind-merge',
    ],
  },
  cacheDir: 'node_modules/.vite',
}));
