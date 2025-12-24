# HoleScale Content Implementation Plan

## ✅ Completed

### 1. Blog Database Schema
- **File**: `supabase/migrations/002_blog_schema.sql`
- **Status**: Created
- **What it does**:
  - Creates blog_posts table with full SEO fields
  - Creates blog_internal_links, blog_categories, blog_tags tables
  - Sets up RLS policies for public access
  - Includes read time calculation
  - Default categories pre-populated

### 2. Blog Import Script
- **File**: `import-blogs-from-json.mjs`
- **Status**: Created
- **How to run**:
  ```bash
  node import-blogs-from-json.mjs
  ```
- **What it does**:
  - Reads buyer-blogs.json and supplier-blogs.json
  - Imports all 12 blog posts
  - Handles duplicates (updates instead of errors)
  - Imports internal links
  - Calculates read time automatically

## 🚧 In Progress

### 3. Blog Pages (Need to Create)

#### Blog List Page
**File to create**: `src/pages/Blog.tsx`
```typescript
// Shows all blog posts with filtering by category
// Grid layout with featured images
// Search and filter by category/persona
// Pagination
```

#### Blog Post Page
**File to create**: `src/pages/BlogPost.tsx`
```typescript
// Dynamic route: /blog/:slug
// Full post content with proper formatting
// Related posts sidebar
// Share buttons
// Schema.org markup for SEO
```

### 4. Buyer Landing Page
**File to create**: `src/pages/GetQuotes.tsx` (or `/Buyers.tsx`)
- Convert BuyerLandingPage.jsx to Tailwind CSS
- Integrate with existing components (Button, Form, etc.)
- Connect form to backend
- Add Schema.org FAQ markup

### 5. Calculators

#### Unit Cost Calculator
**File to create**: `src/pages/tools/UnitCostCalculator.tsx`
- Convert inline styles to Tailwind
- Add chart visualization (recharts)
- CTA to quote form
- Save state to localStorage

#### Tax Deductible Calculator
**File to create**: `src/pages/tools/TaxCalculator.tsx`
- IRS gift limit calculator
- Add/remove items interface
- Visual breakdown
- FAQ with Schema.org

## 📋 Implementation Checklist

### Phase 1: Database & Import (DONE ✅)
- [x] Create blog schema migration
- [x] Create import script
- [ ] Run migration: `Copy 002_blog_schema.sql to Supabase SQL Editor and run`
- [ ] Run import: `node import-blogs-from-json.mjs`

### Phase 2: Blog Infrastructure
- [ ] Create `src/pages/Blog.tsx` (blog list)
- [ ] Create `src/pages/BlogPost.tsx` (single post view)
- [ ] Create `src/components/blog/BlogCard.tsx`
- [ ] Create `src/components/blog/BlogSidebar.tsx`
- [ ] Add routes to App.tsx:
  ```typescript
  <Route path="/blog" element={<Blog />} />
  <Route path="/blog/:slug" element={<BlogPost />} />
  ```

### Phase 3: Landing Pages
- [ ] Create `src/pages/GetQuotes.tsx` from BuyerLandingPage.jsx
- [ ] Create `src/pages/Suppliers.tsx` (if SupplierLandingPage.jsx exists)
- [ ] Add routes:
  ```typescript
  <Route path="/get-quotes" element={<GetQuotes />} />
  <Route path="/buyers" element={<GetQuotes />} />
  <Route path="/suppliers" element={<SuppliersLanding />} />
  ```

### Phase 4: Calculators
- [ ] Create `src/pages/tools/` directory
- [ ] Create `UnitCostCalculator.tsx`
- [ ] Create `TaxCalculator.tsx`
- [ ] Add routes:
  ```typescript
  <Route path="/tools/unit-cost-calculator" element={<UnitCostCalculator />} />
  <Route path="/tools/tax-calculator" element={<TaxCalculator />} />
  ```

### Phase 5: SEO & Polish
- [ ] Add sitemap generation for blog posts
- [ ] Submit to Google Search Console
- [ ] Add OpenGraph images for blog posts
- [ ] Set up blog RSS feed
- [ ] Add related posts logic
- [ ] Test all internal links

## Quick Start Commands

```bash
# 1. Run database migration
# Copy supabase/migrations/002_blog_schema.sql to Supabase SQL Editor
# Click "Run"

# 2. Import blog content
node import-blogs-from-json.mjs

# 3. Start dev server and test
npm run dev
# Visit: http://localhost:3000/blog
```

## File Locations Reference

```
holescale-marketing/
├── 1files/                          # Source files (provided)
│   ├── buyer-blogs.json            # 6 buyer-focused posts
│   ├── supplier-blogs.json         # 6 supplier-focused posts
│   ├── BuyerLandingPage.jsx        # Landing page template
│   ├── UnitCostCalculator.jsx      # Calculator template
│   └── TaxDeductibleSwagCalculator.jsx
│
├── supabase/migrations/
│   └── 002_blog_schema.sql         # ✅ Created
│
├── import-blogs-from-json.mjs      # ✅ Created
│
├── src/pages/
│   ├── Blog.tsx                    # TODO: Create
│   ├── BlogPost.tsx                # TODO: Create
│   ├── GetQuotes.tsx               # TODO: Create from BuyerLandingPage.jsx
│   └── tools/
│       ├── UnitCostCalculator.tsx  # TODO: Create
│       └── TaxCalculator.tsx       # TODO: Create
│
└── src/components/blog/
    ├── BlogCard.tsx                # TODO: Create
    ├── BlogSidebar.tsx             # TODO: Create
    └── BlogNav.tsx                 # TODO: Create
```

## Internal Linking Strategy

Once blogs are imported, ensure these key links exist:

### Buyer Content → Actions
- Blog posts → `/tools/unit-cost-calculator`
- Blog posts → `/get-quotes`
- Calculators → `/get-quotes`

### Supplier Content → Actions
- Blog posts → `/suppliers` (signup)
- Blog posts → Other supplier blogs

### Cross-Linking
See README.md "Cross-Linking Map" section for specific post-to-post links.

## SEO Implementation

### Blog Post Meta Tags
Each blog post should have:
```html
<title>{meta_title}</title>
<meta name="description" content="{meta_description}" />
<meta name="keywords" content="{target_keywords.join(', ')}" />
<link rel="canonical" href="https://holescale.com/blog/{slug}" />
```

### Schema.org Markup
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{meta_description}",
  "author": {
    "@type": "Organization",
    "name": "HoleScale"
  },
  "publisher": {
    "@type": "Organization",
    "name": "HoleScale",
    "logo": {
      "@type": "ImageObject",
      "url": "https://holescale.com/logo.png"
    }
  },
  "datePublished": "{published_at}",
  "dateModified": "{updated_at}"
}
```

## Next Actions

1. **Run migration** (5 minutes)
2. **Run import** (2 minutes)
3. **Create blog pages** (2-3 hours)
4. **Create landing pages** (3-4 hours)
5. **Create calculators** (4-6 hours)
6. **Test & polish** (2-3 hours)

**Total estimated time**: 12-16 hours

## Questions?

- Check README.md in 1files/ for detailed component descriptions
- Blog JSON files have complete content ready to import
- All SEO metadata is pre-configured in JSON
