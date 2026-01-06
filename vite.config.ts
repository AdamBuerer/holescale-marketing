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
          // Minimal chunking to avoid circular dependency issues
          // Only split libraries that are truly isolated
          if (id.includes('node_modules')) {
            // Radix UI - isolated component library
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            // Lucide icons - isolated
            if (id.includes('lucide-react')) {
              return 'lucide-icons';
            }
            // Charts - only on specific pages
            if (id.includes('recharts')) {
              return 'recharts';
            }
            // PDF tools - only when needed
            if (id.includes('fabric') || id.includes('jspdf')) {
              return 'pdf-tools';
            }
            // Framer motion - animations
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            // Everything else goes to vendor (including react, router, supabase)
            // This avoids circular dependency issues
            return 'vendor';
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
