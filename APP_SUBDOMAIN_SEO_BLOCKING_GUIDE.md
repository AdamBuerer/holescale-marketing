# App Subdomain SEO Blocking Guide
## Block app.holescale.com from Search Engines

This guide provides instructions for blocking app.holescale.com from search engine indexing. **These changes must be made in your APP project repository** (not the marketing site).

---

## ⚠️ Important Context

**Current Project:** holescale-marketing (marketing site at holescale.com)
**Target Project:** app.holescale.com (application subdomain - separate project)

The following changes need to be implemented in your **app.holescale.com** project repository.

---

## Task 1: Create robots.txt for App Subdomain

### Location: `public/robots.txt` in APP project

Create or replace the robots.txt file with the following content:

```txt
# Block all crawlers from app.holescale.com
User-agent: *
Disallow: /

# Block AI crawlers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: CCBot
Disallow: /
```

---

## Task 2: Add Meta Robots Tag to App

### For React/Vite Apps:

Find your root HTML file (typically `index.html`) and add to the `<head>` section:

```html
<meta name="robots" content="noindex, nofollow">
<meta name="googlebot" content="noindex, nofollow">
```

### For Next.js Apps:

#### Option A: In `app/layout.tsx` (App Router):

```tsx
export const metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}
```

#### Option B: In `pages/_document.tsx` (Pages Router):

```tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

---

## Task 3: Configure vercel.json for HTTP Headers

### Location: `vercel.json` in APP project root

Create or update your `vercel.json` file:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    }
  ]
}
```

### If vercel.json already exists:

Merge the headers configuration with your existing config. For example:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ],
  "redirects": [
    // your existing redirects...
  ]
}
```

---

## Task 4: Update Footer Links (Optional but Recommended)

Add links back to the marketing site in your app's footer:

```tsx
<footer>
  <a href="https://holescale.com">About HoleScale</a>
  <a href="https://holescale.com/pricing">Pricing</a>
  <a href="https://holescale.com/faq">Help & FAQ</a>
  <a href="https://holescale.com/contact">Contact</a>
</footer>
```

**Note:** These links do NOT need `rel="nofollow"` since they're linking FROM the app TO the marketing site (which should be indexed).

---

## Verification After Deployment

After implementing these changes and deploying to Vercel:

### 1. Check robots.txt
Visit: `https://app.holescale.com/robots.txt`
Should display your blocking rules.

### 2. Check Meta Tags
Visit: `https://app.holescale.com`
View source (Ctrl/Cmd + U) and search for:
```html
<meta name="robots" content="noindex, nofollow">
```

### 3. Check HTTP Headers
Use curl to verify the X-Robots-Tag header:
```bash
curl -I https://app.holescale.com
```

Should include:
```
X-Robots-Tag: noindex, nofollow
```

### 4. Test with Google Search Console
1. Add app.holescale.com to Google Search Console
2. Submit robots.txt for crawling
3. Use URL Inspection tool to verify indexing is blocked

---

## Expected Results

After implementation:
- ✅ Search engines will not index any pages on app.holescale.com
- ✅ Existing indexed pages (if any) will eventually be removed from search results
- ✅ holescale.com (marketing site) will continue to be indexed normally
- ✅ Users can still access app.holescale.com directly via URL

---

## Summary Checklist

**APP Project (app.holescale.com):**
- [ ] Create `public/robots.txt` with blocking rules
- [ ] Add meta robots tag to HTML head
- [ ] Create/update `vercel.json` with X-Robots-Tag header
- [ ] Add links back to holescale.com in footer
- [ ] Deploy changes to Vercel
- [ ] Verify robots.txt is accessible
- [ ] Verify meta tags in page source
- [ ] Verify HTTP headers with curl
- [ ] Test with Google Search Console

**Marketing Project (holescale.com):** ✅ All tasks completed!
- [x] Enhanced meta tags in index.html
- [x] Added JSON-LD structured data
- [x] Updated sitemap.xml
- [x] Updated robots.txt
- [x] Added `rel="nofollow"` to all app.holescale.com links

---

## Questions?

If you need help implementing these changes or have questions about your specific app setup, please let me know!
