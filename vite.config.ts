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
          // Split vendor chunks for better caching and reduced initial load
          if (id.includes('node_modules')) {
            // React core - needed immediately
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'react-core';
            }
            // Router - needed for navigation
            if (id.includes('react-router')) {
              return 'router';
            }
            // Framer motion - only needed for animations
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            // Radix UI - only load when components are used
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            // React Query - data fetching
            if (id.includes('@tanstack/react-query')) {
              return 'react-query';
            }
            // Icons - lazy load
            if (id.includes('lucide-react')) {
              return 'lucide-icons';
            }
            // Charts - only on pages with charts
            if (id.includes('recharts')) {
              return 'recharts';
            }
            // PDF tools - only when needed
            if (id.includes('fabric') || id.includes('jspdf')) {
              return 'pdf-tools';
            }
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'forms';
            }
            // Date utilities
            if (id.includes('date-fns')) {
              return 'date-utils';
            }
            // Note: @supabase is NOT manually chunked to avoid circular dependency issues
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
