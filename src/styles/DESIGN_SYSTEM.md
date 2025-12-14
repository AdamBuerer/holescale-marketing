# HoleScale Design System Reference

**Last Updated:** 2025-01-27  
**Purpose:** Comprehensive design system documentation for consistent UI/UX across all portals (Buyer, Supplier, Admin)

---

## 📐 Typography Scale

### Fluid Typography

**Implementation:** All headings use `clamp()` for fluid scaling across breakpoints.

**Scale:**
- **H1:** `clamp(1.5rem, 4vw, 3rem)` - Scales from 24px to 48px
- **H2:** `clamp(1.25rem, 3vw, 2rem)` - Scales from 20px to 32px
- **H3:** `clamp(1.125rem, 2.5vw, 1.5rem)` - Scales from 18px to 24px
- **H4:** `clamp(1rem, 2vw, 1.25rem)` - Scales from 16px to 20px
- **H5:** `clamp(0.875rem, 1.5vw, 1.125rem)` - Scales from 14px to 18px
- **H6:** `clamp(0.75rem, 1.25vw, 1rem)` - Scales from 12px to 16px

**Benefits:**
- Smooth scaling between breakpoints
- Optimal readability at all screen sizes
- No need for multiple media queries

**Location:** Defined in `src/index.css` with CSS clamp() functions.

### Heading Hierarchy

#### H1 - Page Titles
**Usage:** Main page titles, hero headings, dashboard titles

**Classes:**
```tsx
// Marketing/Landing pages (larger)
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">

// Dashboard/App pages (standard)
<h1 className="text-3xl font-bold">
```

**Examples:**
- Landing page hero: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold`
- Dashboard title: `text-3xl font-bold`
- Page header: `text-3xl font-bold mb-2`

**When to use:**
- One H1 per page
- Main page identifier
- Hero sections on marketing pages

---

#### H2 - Section Headers
**Usage:** Major section titles, card group headers

**Classes:**
```tsx
// Large sections
<h2 className="text-4xl font-bold">

// Standard sections
<h2 className="text-2xl font-bold">

// With responsive sizing
<h2 className="text-2xl md:text-3xl font-bold">
```

**Examples:**
- Marketing sections: `text-4xl font-bold mb-4`
- Dashboard sections: `text-2xl font-bold`
- Card group headers: `text-2xl font-bold mb-6`

**When to use:**
- Major content sections
- Card group titles
- Feature sections

---

#### H3 - Card Titles & Subsections
**Usage:** Card titles, modal headers, subsection titles

**Classes:**
```tsx
// Card titles
<h3 className="text-xl font-semibold">

// Or with responsive
<h3 className="text-lg md:text-xl font-semibold">
```

**Examples:**
- Card titles: `text-xl font-semibold mb-2`
- Modal headers: `text-xl font-semibold`
- Subsection titles: `text-lg font-semibold`

**When to use:**
- Individual card titles
- Modal/dialog headers
- Subsection headers within larger sections

---

#### H4 - Form Sections & Minor Headings
**Usage:** Form section headers, minor subsections

**Classes:**
```tsx
<h4 className="text-lg font-semibold">
```

**Examples:**
- Form sections: `text-lg font-semibold mb-4`
- Minor subsections: `text-lg font-semibold`

**When to use:**
- Form section headers
- Minor content divisions

---

### Body Text

#### Primary Body Text
**Usage:** Main content, descriptions, paragraphs

**Classes:**
```tsx
// Standard body (16px)
<p className="text-base">

// With responsive sizing
<p className="text-base md:text-lg">

// Muted/Secondary text
<p className="text-base text-muted-foreground">
```

**Examples:**
- Paragraphs: `text-base text-muted-foreground`
- Descriptions: `text-base md:text-lg text-muted-foreground`
- Card descriptions: `text-sm text-muted-foreground`

**When to use:**
- All paragraph text
- Descriptions
- Card content

---

#### Secondary Text
**Usage:** Helper text, metadata, timestamps

**Classes:**
```tsx
// Small text (14px)
<p className="text-sm text-muted-foreground">

// Extra small (12px)
<p className="text-xs text-muted-foreground">
```

**Examples:**
- Helper text: `text-sm text-muted-foreground`
- Timestamps: `text-xs text-muted-foreground`
- Labels: `text-xs text-muted-foreground`

**When to use:**
- Metadata
- Timestamps
- Helper/instructional text
- Form labels

---

### Typography Best Practices

✅ **DO:**
- Use semantic HTML (`<h1>`, `<h2>`, etc.)
- Maintain hierarchy (h1 → h2 → h3 → h4)
- Use `text-muted-foreground` for secondary text
- Use responsive text sizing for marketing pages
- Keep body text minimum 16px on mobile

❌ **DON'T:**
- Skip heading levels (don't go h1 → h3)
- Use arbitrary font sizes (`text-[17px]`)
- Hardcode colors for text (use semantic tokens)
- Use headings for styling only (use semantic meaning)

---

## 📏 Spacing Standards

### Page Containers

#### Standard Page Container
**Usage:** Most pages, dashboards

**Classes:**
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
```

**Breakdown:**
- Mobile: `px-4` (16px padding)
- Tablet: `sm:px-6` (24px padding)
- Desktop: `lg:px-8` (32px padding)
- Max-width: `max-w-7xl` (1280px)

**Examples:**
- Dashboard: `container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl`
- List pages: `container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl`

---

#### Narrow Container
**Usage:** Forms, detail pages, settings

**Classes:**
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
```

**When to use:**
- Settings pages
- Form pages
- Detail/read-only pages
- Profile pages

---

#### Wide Container
**Usage:** Marketing pages, landing pages

**Classes:**
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

**When to use:**
- Marketing/landing pages
- Full-width content sections

---

### Section Spacing

#### Vertical Section Spacing
**Usage:** Space between major sections

**Classes:**
```tsx
// Large sections (marketing pages)
<section className="py-20">

// Standard sections
<section className="py-12">

// Compact sections
<section className="py-8">
```

**Examples:**
- Marketing sections: `py-20`
- Dashboard sections: `py-12` or `mb-12`
- Card groups: `mb-8` or `mb-12`

---

#### Internal Section Spacing
**Usage:** Spacing within sections

**Classes:**
```tsx
// Standard vertical spacing
<div className="space-y-6">

// Compact spacing
<div className="space-y-4">

// Spacious spacing
<div className="space-y-8">
```

**When to use:**
- Form fields: `space-y-4` or `space-y-6`
- Card lists: `space-y-4`
- Content sections: `space-y-6`

---

### Card Padding

**Standard Card Padding:**
```tsx
// Standard (24px)
<Card className="p-6">

// Compact (16px)
<Card className="p-4">

// Spacious (32px)
<Card className="p-8">
```

**Responsive Card Padding:**
```tsx
// Reduce on mobile if needed
<Card className="p-4 md:p-6">
```

**When to use:**
- Most cards: `p-6`
- Small cards: `p-4`
- Large feature cards: `p-8`
- Mobile-optimized: `p-4 md:p-6`

---

### Grid Gaps

**Standard Grid Gaps:**
```tsx
// Standard gap (24px)
<div className="grid gap-6">

// Compact gap (16px)
<div className="grid gap-4">

// Spacious gap (32px)
<div className="grid gap-8">
```

**Responsive Grid Gaps:**
```tsx
// Adjust for mobile
<div className="grid gap-4 md:gap-6">
```

**When to use:**
- Card grids: `gap-6`
- Stats grids: `gap-4` or `gap-6`
- Product grids: `gap-4 md:gap-6`

---

### Form Spacing

**Form Container:**
```tsx
<form className="space-y-6">
```

**Form Field Group:**
```tsx
<div className="space-y-2">
  <Label>Field Name</Label>
  <Input />
</div>
```

**Form Section:**
```tsx
<div className="space-y-4 mb-6">
  <h4>Section Title</h4>
  {/* Fields */}
</div>
```

---

## 🎨 Color Usage

### Primary Colors

**Primary Action:**
```tsx
// Primary button/action
<Button className="bg-primary text-primary-foreground">

// Primary text
<span className="text-primary">

// Primary background (subtle)
<div className="bg-primary/10">
```

**Usage:**
- Primary CTAs
- Links
- Active states
- Brand elements

---

### Secondary Colors

**Secondary Action:**
```tsx
// Secondary button
<Button variant="secondary" className="bg-secondary text-secondary-foreground">

// Secondary background
<div className="bg-secondary/10">
```

**Usage:**
- Secondary actions
- Alternative CTAs
- Supporting elements

---

### Muted Colors

**Muted Text:**
```tsx
// Muted foreground text
<p className="text-muted-foreground">

// Muted background
<div className="bg-muted">
```

**Usage:**
- Secondary text
- Helper text
- Disabled states
- Subtle backgrounds

---

### Semantic Colors

**Success:**
```tsx
<Button variant="success" className="bg-success text-success-foreground">
<Badge className="bg-success/10 text-success">
```

**Warning:**
```tsx
<Button variant="warning" className="bg-warning text-warning-foreground">
<Badge className="bg-warning/10 text-warning">
```

**Destructive:**
```tsx
<Button variant="destructive" className="bg-destructive text-destructive-foreground">
<Badge className="bg-destructive/10 text-destructive">
```

**Usage:**
- Success states: Completed orders, successful actions
- Warning states: Pending items, caution messages
- Destructive states: Delete actions, errors

---

### Background Colors

**Page Background:**
```tsx
<div className="bg-background">
```

**Card Background:**
```tsx
<Card className="bg-card">
```

**Muted Background:**
```tsx
<section className="bg-muted/30">
```

---

### Color Best Practices

✅ **DO:**
- Use semantic color tokens (`bg-primary`, `text-muted-foreground`)
- Use opacity variants for subtle backgrounds (`bg-primary/10`)
- Maintain sufficient contrast (WCAG AA minimum)

❌ **DON'T:**
- Hardcode colors (`bg-blue-500`)
- Use arbitrary color values
- Create one-off color variations
- Use low contrast combinations

---

## 🧩 Component Standards

### Cards

**Standard Card:**
```tsx
<Card className="p-6">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Card Variants:**
```tsx
// Standard
<Card className="p-6">

// Compact
<Card className="p-4">

// Spacious
<Card className="p-8">

// With hover
<Card className="p-6 hover:shadow-lg transition-shadow">
```

**Card Best Practices:**
- Use `p-6` for standard cards
- Add `hover:shadow-lg` for interactive cards
- Use `CardHeader`, `CardTitle`, `CardDescription` for structure
- Maintain consistent padding across card types

---

### Buttons

**Button Variants:**
```tsx
// Primary action
<Button variant="default">Primary Action</Button>

// Secondary action
<Button variant="outline">Secondary Action</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Ghost (minimal)
<Button variant="ghost">Cancel</Button>

// Link style
<Button variant="link">Learn More</Button>
```

**Button Sizes:**
```tsx
// Small
<Button size="sm">Small</Button>

// Default (44px min height for touch)
<Button size="default">Default</Button>

// Large
<Button size="lg">Large</Button>

// Icon only
<Button size="icon">
  <Icon />
</Button>
```

**Button Best Practices:**
- All buttons have `min-h-[44px]` for touch targets
- Use `variant="default"` for primary actions
- Use `variant="outline"` for secondary actions
- Use `variant="destructive"` for delete/destructive actions
- Full-width on mobile: `w-full md:w-auto`

---

### Form Inputs

**Standard Input:**
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="Enter your email"
  />
</div>
```

**Input Sizing:**
- Default: `h-11` (44px) - meets touch target requirements
- Mobile: `min-h-[44px]` - ensures proper touch targets
- Font size: `text-base` on mobile (prevents zoom), `md:text-sm` on desktop

**Form Field Spacing:**
```tsx
// Standard form
<form className="space-y-6">
  <div className="space-y-2">
    <Label>Field</Label>
    <Input />
  </div>
</form>
```

**Form Best Practices:**
- Always associate labels with inputs (`htmlFor` + `id`)
- Use `space-y-2` for label + input pairs
- Use `space-y-6` for form field groups
- Full-width inputs on mobile: `w-full`
- Show error states with `error` prop

---

### Tables

**Standard Table:**
```tsx
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <div className="inline-block min-w-full align-middle">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Column 1</TableHead>
          <TableHead>Column 2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Data 1</TableCell>
          <TableCell>Data 2</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</div>
```

**Responsive Table Wrapper:**
```tsx
// Mobile: horizontal scroll
// Desktop: normal table
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <div className="inline-block min-w-full align-middle sm:rounded-lg border">
    <Table>
      {/* Table content */}
    </Table>
  </div>
</div>
```

**Table Best Practices:**
- Always wrap tables in responsive container on mobile
- Use `-mx-4 sm:mx-0` to allow full-width scroll on mobile
- Use `min-w-full` to ensure table doesn't shrink
- Consider card layout for mobile if table is complex
- Maintain proper header visibility

---

### Dialogs/Modals

**Standard Dialog:**
```tsx
<Dialog>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

**Mobile-Optimized Dialog:**
```tsx
// Full-screen on mobile, centered on desktop
<Dialog>
  <DialogContent className="max-w-md w-full h-full md:h-auto md:max-h-[90vh] md:rounded-lg">
    {/* Content */}
  </DialogContent>
</Dialog>
```

**Dialog Best Practices:**
- Use appropriate max-width (`max-w-md`, `max-w-lg`, `max-w-2xl`)
- Ensure close button is accessible
- Make content scrollable if tall
- Full-screen on mobile for better UX
- Use `DialogHeader`, `DialogTitle`, `DialogDescription` for structure

---

## 📱 Responsive Breakpoints

### Breakpoint Scale

**Standard Tailwind Breakpoints:**
- `sm:` - 640px (small tablets, large phones landscape)
- `md:` - 768px (tablets portrait)
- `lg:` - 1024px (tablets landscape, small laptops)
- `xl:` - 1280px (desktops)
- `2xl:` - 1536px (large desktops)
- `3xl:` - 1440px (large desktop, custom breakpoint)

**Breakpoint Values (from `src/lib/theme.ts`):**
```typescript
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1440px', // Custom breakpoint
} as const;
```

---

### Mobile-First Approach

**Base Styles (Mobile):**
```tsx
// Base: mobile styles
<div className="flex flex-col gap-4 p-4">
```

**Add Breakpoint Overrides:**
```tsx
// Mobile-first with desktop overrides
<div className="flex flex-col md:flex-row gap-4 p-4 md:p-6">
```

**Pattern:**
1. Write base styles for mobile (320px+)
2. Add `sm:` for small tablets (640px+)
3. Add `md:` for tablets (768px+)
4. Add `lg:` for desktops (1024px+)
5. Add `xl:` for large desktops (1280px+)
6. Add `3xl:` for very large desktops (1440px+)

**Using Responsive Hooks:**
```tsx
import { useIsMobile } from '@/hooks/use-mobile';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useResponsive } from '@/contexts/ResponsiveContext';

// Single breakpoint
const isMobile = useIsMobile();

// Custom query
const isDesktop = useMediaQuery('(min-width: 1024px)');

// Multiple breakpoints
const { isMobile, isTablet, isDesktop } = useResponsive();
```

---

### Common Responsive Patterns

#### Container Padding
```tsx
// Standard responsive padding
<div className="px-4 sm:px-6 lg:px-8">
```

#### Grid Layouts
```tsx
// Stack on mobile, grid on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

#### Flex Direction
```tsx
// Column on mobile, row on desktop
<div className="flex flex-col sm:flex-row gap-4">
```

#### Text Sizing
```tsx
// Responsive text sizing
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
```

#### Visibility
```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">

// Show on mobile, hide on desktop
<div className="md:hidden">
```

---

## 🖼️ Image Optimization Strategy

### Responsive Images

**Component:** `LazyImage` from `@/components/ui/lazy-image`

**Features:**
- Lazy loading with Intersection Observer
- Responsive images with srcSet
- WebP format with JPEG fallback
- Automatic fallback handling

**Basic Usage:**
```tsx
import { LazyImage } from '@/components/ui/lazy-image';

<LazyImage
  src="/image.jpg"
  alt="Description"
  className="w-full h-48 object-cover"
/>
```

**Responsive Images with srcSet:**
```tsx
import { LazyImage } from '@/components/ui/lazy-image';
import { generateResponsiveSrcSet, getResponsiveSizes } from '@/lib/image-utils';

<LazyImage
  src="/product.jpg"
  alt="Product name"
  srcSet={generateResponsiveSrcSet('/product.jpg', 'card')}
  sizes={getResponsiveSizes({
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw'
  })}
  enableWebP={true}
/>
```

**Image Utility Functions:**
- `generateSrcSet(imageUrl, widths)` - Generate srcSet entries
- `generateResponsiveSrcSet(imageUrl, scenario)` - Common scenarios (thumbnail, card, hero, full)
- `getWebPUrl(imageUrl)` - Get WebP version of URL
- `getResponsiveSizes(breakpoints)` - Generate sizes attribute

**Best Practices:**
- Always provide alt text
- Use appropriate image sizes for breakpoints
- Enable WebP for better compression
- Use lazy loading for below-fold images

#### Button Width
```tsx
// Full-width on mobile, auto on desktop
<Button className="w-full md:w-auto">
```

---

### Responsive Best Practices

✅ **DO:**
- Start with mobile styles (mobile-first)
- Test at 320px, 768px, 1024px, 1440px
- Use consistent breakpoint patterns
- Ensure touch targets are 44x44px minimum
- Prevent horizontal overflow

❌ **DON'T:**
- Use desktop-first approach
- Use arbitrary breakpoints
- Create one-off responsive patterns
- Forget to test on actual devices
- Allow horizontal scrolling

---

## 🚫 Anti-Patterns to Avoid

### Typography Anti-Patterns

❌ **DON'T:**
```tsx
// Arbitrary font sizes
<h1 className="text-[28px]">

// Skipping heading levels
<h1>Title</h1>
<h3>Subtitle</h3>  // Missing h2

// Using headings for styling only
<h2 className="text-sm">Small text</h2>
```

✅ **DO:**
```tsx
// Use standard scale
<h1 className="text-3xl font-bold">

// Maintain hierarchy
<h1>Title</h1>
<h2>Subtitle</h2>

// Use appropriate element
<p className="text-sm">Small text</p>
```

---

### Spacing Anti-Patterns

❌ **DON'T:**
```tsx
// Arbitrary spacing values
<div className="mb-[13px]">

// Inconsistent padding
<Card className="p-5">

// Mixed spacing units
<div className="mb-3 md:mb-6 lg:mb-8">
```

✅ **DO:**
```tsx
// Use standard spacing scale
<div className="mb-4">

// Consistent padding
<Card className="p-6">

// Consistent responsive spacing
<div className="mb-6 md:mb-8">
```

---

### Color Anti-Patterns

❌ **DON'T:**
```tsx
// Hardcoded colors
<div className="bg-blue-500 text-white">

// Arbitrary color values
<div className="bg-[#3b82f6]">
```

✅ **DO:**
```tsx
// Use semantic tokens
<div className="bg-primary text-primary-foreground">

// Use theme colors
<div className="bg-card text-card-foreground">
```

---

### Component Anti-Patterns

❌ **DON'T:**
```tsx
// Missing touch targets
<Button className="h-8">Small</Button>

// Inconsistent card padding
<Card className="p-3">

// Tables without responsive wrapper
<Table>
  {/* Complex table */}
</Table>
```

✅ **DO:**
```tsx
// Proper touch targets
<Button className="min-h-[44px]">Action</Button>

// Consistent padding
<Card className="p-6">

// Responsive table
<div className="overflow-x-auto">
  <Table>
    {/* Table */}
  </Table>
</div>
```

---

### Responsive Anti-Patterns

❌ **DON'T:**
```tsx
// Desktop-first
<div className="flex-row md:flex-col">

// Arbitrary breakpoints
<div className="min-[847px]:grid-cols-3">

// Fixed widths
<div className="w-[347px]">
```

✅ **DO:**
```tsx
// Mobile-first
<div className="flex-col md:flex-row">

// Standard breakpoints
<div className="md:grid-cols-3">

// Flexible widths
<div className="w-full md:w-auto">
```

---

## 📋 Quick Reference

### Typography Classes
- H1: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold`
- H2: `text-2xl font-bold` or `text-4xl font-bold`
- H3: `text-xl font-semibold`
- H4: `text-lg font-semibold`
- Body: `text-base`
- Small: `text-sm text-muted-foreground`
- Caption: `text-xs text-muted-foreground`

### Spacing Classes
- Container: `px-4 sm:px-6 lg:px-8`
- Section: `py-12` or `py-20`
- Card: `p-6`
- Gap: `gap-4` or `gap-6`
- Form: `space-y-6`

### Color Classes
- Primary: `bg-primary text-primary-foreground`
- Secondary: `bg-secondary text-secondary-foreground`
- Muted: `text-muted-foreground`
- Success: `bg-success text-success-foreground`
- Warning: `bg-warning text-warning-foreground`
- Destructive: `bg-destructive text-destructive-foreground`

### Component Classes
- Button: `min-h-[44px]` (touch target)
- Input: `min-h-[44px]` (touch target)
- Card: `p-6`
- Table wrapper: `overflow-x-auto -mx-4 sm:mx-0`

---

## 📚 Reference Pages

### Best Design Examples

**Landing/Marketing:**
- `src/pages/Index.tsx` - Excellent responsive typography and spacing
- `src/pages/About.tsx` - Good section spacing and grid layouts

**Dashboards:**
- `src/pages/buyer/Dashboard.tsx` - Good card layouts and responsive grids
- `src/pages/supplier/SupplierDashboard.tsx` - Consistent spacing patterns
- `src/pages/admin/AdminDashboard.tsx` - Good stat card patterns

**Workflows:**
- `src/pages/buyer/CreateRFQ.tsx` - Form spacing and responsive layout
- `src/pages/buyer/Suppliers.tsx` - Search and filter responsive patterns

---

## 🔄 Design System Updates

This document should be updated when:
- New component patterns are established
- Spacing standards change
- Typography scale is adjusted
- New responsive patterns are introduced
- Color tokens are added or modified

**Update Process:**
1. Document the change in this file
2. Update affected components
3. Update reference examples
4. Communicate changes to team

---

**End of Design System Reference**

