#!/usr/bin/env node
/**
 * Static Site Generation (SSG) Script
 * Pre-renders React routes to static HTML for better performance and SEO
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import handler from 'serve-handler';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

// Routes to prerender
const routes = [
  '/',
  '/how-it-works',
  '/features',
  '/pricing',
  '/for-buyers',
  '/for-suppliers',
  '/waitlist',
  '/get-quotes',
  '/investors',
  '/resources',
  '/faq',
  '/about',
  '/contact',
  '/blog',
  '/glossary',
  '/terms',
  '/privacy',
  '/tools/unit-cost-calculator',
  '/tools/tax-calculator',
];

const PORT = 4173;

async function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      handler(req, res, {
        public: distDir,
        // Route all HTML requests to a pristine, never-overwritten shell so each
        // route boots from an empty #root and client-renders its own content.
        rewrites: [{ source: '**', destination: '/__shell.html' }],
      });
    });
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`📦 Preview server running on http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  const url = `http://127.0.0.1:${PORT}${route}`;

  try {
    console.log(`  Rendering: ${route}`);

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    // Log console messages for debugging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`    [Console Error]: ${msg.text()}`);
      }
    });

    // Navigate and wait for network idle
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // Wait a bit for React hydration
    await new Promise(r => setTimeout(r, 2000));

    // Get the rendered HTML
    let html = await page.content();

    // Mark as server-rendered
    html = html.replace(
      '<div id="root">',
      '<div id="root" data-server-rendered="true">'
    );

    // Remove the loading skeleton since content is pre-rendered
    html = html.replace(
      /<div id="hs-loading"[^>]*>[\s\S]*?<\/div>\s*<!-- Error state/,
      '<!-- Pre-rendered: skeleton removed -->\n    <!-- Error state'
    );

    // Determine output path
    const outputPath = route === '/'
      ? join(distDir, 'index.html')
      : join(distDir, route, 'index.html');

    // Create directory if needed
    const outputDir = dirname(outputPath);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Write the pre-rendered HTML
    writeFileSync(outputPath, html);
    console.log(`  ✓ Saved: ${outputPath.replace(distDir, 'dist')}`);

  } catch (error) {
    console.error(`  ✗ Failed: ${route} - ${error.message}`);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('\n🚀 Starting SSG Pre-rendering...\n');

  // Verify dist exists
  if (!existsSync(distDir)) {
    console.error('❌ dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Preserve a pristine SPA shell (empty #root) so every route boots clean and
  // client-renders its own content instead of inheriting an already-rendered page.
  const shellPath = join(distDir, '__shell.html');
  copyFileSync(join(distDir, 'index.html'), shellPath);

  // Start preview server
  const server = await startServer();

  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    // Use system Chrome in CI if available
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });

  console.log(`\n📄 Pre-rendering ${routes.length} routes...\n`);

  // Prerender all routes
  for (const route of routes) {
    await prerenderRoute(browser, route);
  }

  // Cleanup
  await browser.close();
  server.close();
  if (existsSync(shellPath)) unlinkSync(shellPath);

  console.log('\n✅ SSG Pre-rendering complete!\n');
}

main().catch(console.error);
