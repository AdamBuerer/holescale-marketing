# HoleScale Responsive Design Guide

Complete documentation of responsive design patterns, breakpoint strategy, and component guidelines implemented across the HoleScale marketing website.

---

## Table of Contents
1. [Breakpoint Strategy](#breakpoint-strategy)
2. [Component Patterns](#component-patterns)
3. [Accessibility Guidelines](#accessibility-guidelines)
4. [Performance Best Practices](#performance-best-practices)
5. [Testing Checklist](#testing-checklist)

---

## Breakpoint Strategy

### Tailwind CSS Breakpoints

```css
/* Mobile First Approach */
base:  0px     /* Default mobile (320px+) */
sm:    640px   /* Large mobile / Small tablet */
md:    768px   /* Tablet portrait */
lg:    1024px  /* Tablet landscape / Small desktop */
xl:    1280px  /* Desktop */
2xl:   1536px  /* Large desktop */
```

### When to Use Each Breakpoint

**Mobile-first principle**: Write base styles for mobile, then add breakpoints for larger screens.

```tsx
// ✅ Good - Mobile first
<div className="text-sm md:text-base lg:text-lg">

// ❌ Bad - Desktop first with overrides
<div className="text-lg md:text-base sm:text-sm">
```

---

## Component Patterns

### 1. Touch Targets (44x44px Minimum)

All interactive elements must meet WCAG AA touch target requirements.

```tsx
// ✅ Correct implementation
<button className="min-h-[44px] min-w-[44px] px-4">
  Click me
</button>

// ✅ Using inline-flex for proper sizing
<Link className="inline-flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] px-4">
  Learn More
</Link>
```

**Files implementing this**:
- `ShareButtons.tsx`
- `Navigation.tsx`
- All button components

### 2. Responsive Typography

**Heading Scale Pattern** - Limit to 2-3 breakpoints maximum:

```tsx
// ✅ Good - 3 breakpoints
<h1 className="text-4xl md:text-5xl lg:text-6xl">

// ✅ Good - 2 breakpoints
<h2 className="text-2xl md:text-3xl lg:text-4xl">

// ❌ Bad - Too many breakpoints
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
```

**Body Text Pattern**:

```tsx
// Smooth scaling for readability
<p className="text-base sm:text-lg md:text-xl">
  Paragraph content
</p>
```

### 3. Grid Layouts

**Smooth Column Progression** - Always add intermediate steps:

```tsx
// ✅ Good - Smooth 2→3→4 progression
<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

// ❌ Bad - Jumps from 2 to 4 (cramped at 1024px)
<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

**Gap Scaling**:

```tsx
// Scale gaps with viewport
<div className="grid gap-4 sm:gap-6 md:gap-8">
```

### 4. Image Aspect Ratios

**Responsive aspect ratios** prevent awkward cropping on mobile:

```tsx
// ✅ Adaptive aspect ratio
<div className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]">
  <img src={src} className="w-full h-full object-cover" />
</div>

// Use cases:
// - Hero images: 4:3 → 16:9 → 21:9
// - Blog featured images: 4:3 → 16:9 → 21:9
// - Card images: 4:3 → 1:1 (consistent)
```

### 5. Navigation Menus

**Dynamic Width Calculations** for mega menus:

```tsx
// Calculate responsive width based on viewport
const calculateDropdownPosition = useCallback((btnRef, menuWidth) => {
  const rect = btnRef.current?.getBoundingClientRect();
  const viewportWidth = window.innerWidth;

  // Use smaller of desired width or available space
  const responsiveWidth = Math.min(menuWidth, viewportWidth - 32);

  let left = rect.left + rect.width / 2 - responsiveWidth / 2;

  // Keep within viewport bounds
  if (left < 16) left = 16;
  if (left + responsiveWidth > viewportWidth - 16) {
    left = viewportWidth - responsiveWidth - 16;
  }

  return { width: responsiveWidth, left };
}, []);
```

### 6. Touch-Friendly Interactions

**Desktop-only hover effects** prevent accidental triggering on touch devices:

```tsx
// ✅ Correct - Hover only on desktop, active state for all
<button className="md:hover:scale-105 active:scale-95 transition-all">

// ✅ For group hovers
<div className="group">
  <div className="md:group-hover:scale-105 group-active:scale-95">
</div>

// ❌ Wrong - Triggers during touch scroll
<button className="hover:scale-105">
```

### 7. Text Wrapping

**Prevent awkward line breaks** on technical terms:

```tsx
<p className="break-words">
  Compare pricing, <strong className="whitespace-nowrap">MOQs</strong>,
  and <strong className="whitespace-nowrap">lead times</strong> for products.
</p>
```

**Pattern**:
- Apply `break-words` to parent container
- Apply `whitespace-nowrap` to specific terms that should stay together

### 8. Horizontal Scrolling

**Tables and charts** that don't fit on mobile:

```tsx
// Wrapper with scroll
<div className="overflow-x-auto">
  <div className="min-w-[640px]">
    <table className="w-full">
      {/* table content */}
    </table>
  </div>

  {/* Mobile-only scroll indicator */}
  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 sm:hidden">
    <ArrowRight className="w-3 h-3" />
    <span>Scroll to see all columns</span>
  </div>
</div>
```

### 9. Smart Pagination

**Ellipsis pattern** for many pages:

```tsx
const generatePageNumbers = (currentPage, totalPages) => {
  const pages = [];

  if (totalPages <= 7) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    // Show: 1 ... 5 6 7 ... 20
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1);
         i <= Math.min(totalPages - 1, currentPage + 1);
         i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return pages;
};
```

**Responsive pagination buttons**:

```tsx
<button className="w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm">
  {pageNum}
</button>
```

### 10. Blockquote Responsive Padding

```tsx
// In CSS or styled component
.article-content blockquote {
  padding: 1rem 1.25rem; /* Mobile */
}

@media (min-width: 768px) {
  .article-content blockquote {
    padding: 1.5rem 2rem; /* Desktop */
  }
}
```

---

## Accessibility Guidelines

### WCAG AA Compliance

1. **Touch Targets**: Minimum 44x44px for all interactive elements
2. **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
3. **Focus Indicators**: Visible focus states on all interactive elements
4. **Keyboard Navigation**: All functionality accessible via keyboard
5. **ARIA Labels**: Proper labels for form inputs and buttons

### Implementation Checklist

- [ ] All buttons have `min-h-[44px] min-w-[44px]`
- [ ] Links use `inline-flex` with proper sizing
- [ ] Form inputs have associated labels
- [ ] Images have descriptive alt text
- [ ] ARIA attributes used correctly
- [ ] Focus states visible and styled

---

## Performance Best Practices

### Current Metrics (Lighthouse)

- **Accessibility**: 91/100 ✅
- **Best Practices**: 96/100 ✅
- **SEO**: 91/100 ✅
- **Performance**: 56-76/100 (room for improvement)
- **CLS**: 0.0 (Perfect!)

### Optimization Opportunities

1. **Code Splitting**
   ```tsx
   // Lazy load heavy components
   const HeavyComponent = lazy(() => import('./HeavyComponent'));

   <Suspense fallback={<Loading />}>
     <HeavyComponent />
   </Suspense>
   ```

2. **Image Optimization**
   - Use WebP format with fallbacks
   - Implement lazy loading for below-fold images
   - Responsive images with srcset

3. **CSS Optimization**
   - Remove unused Tailwind classes with PurgeCSS
   - Minimize critical CSS

---

## Testing Checklist

### Breakpoint Testing

Test at these specific widths:

#### Critical (320-414px)
- [ ] **320px** (iPhone SE) - Minimum width
  - Navigation doesn't overflow
  - Touch targets are comfortable
  - Text wraps cleanly
  - Tables have scroll indicators

- [ ] **375px** (iPhone 12/13) - Most common mobile
  - All features accessible
  - No horizontal scroll
  - Readable text sizes

- [ ] **414px** (iPhone Pro Max) - Large mobile
  - Layout utilizes space well
  - No cramping

#### Medium (768-1024px)
- [ ] **768px** (iPad Portrait) - Tablet
  - Grids show appropriate columns (2-3)
  - Typography scales smoothly
  - Navigation menus fit comfortably

- [ ] **1024px** (iPad Landscape) - Tablet landscape
  - 3-column grids displayed
  - Hover effects work (if using mouse)
  - No element cramping

#### Desktop (1280px+)
- [ ] **1280px** - Standard desktop
  - 4-column grids where applicable
  - All hover effects functional
  - Optimal reading width maintained

### Feature Testing

- [ ] **Navigation**
  - Mega menus adapt to viewport
  - No horizontal scroll at any breakpoint
  - Touch-friendly on mobile

- [ ] **Forms**
  - Input fields accessible
  - Labels properly associated
  - Touch targets adequate

- [ ] **Images**
  - Aspect ratios adapt properly
  - No layout shift on load
  - Alt text present

- [ ] **Interactive Elements**
  - Hover effects desktop-only
  - Active states work on all devices
  - No accidental triggers during scroll

- [ ] **Tables & Charts**
  - Horizontal scroll on mobile
  - Scroll indicators visible
  - Full width on desktop

- [ ] **Pagination**
  - Ellipsis shows for many pages
  - Buttons sized appropriately
  - No overflow on mobile

### Browser Testing

- [ ] Chrome (Desktop & Mobile)
- [ ] Safari (Desktop & iOS)
- [ ] Firefox (Desktop)
- [ ] Edge (Desktop)

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Touch targets meet 44x44px
- [ ] Color contrast sufficient
- [ ] Focus indicators visible

---

## Quick Reference

### Common Responsive Patterns

```tsx
// Section padding
<section className="py-8 sm:py-12 md:py-16 lg:py-20">

// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Grid
<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">

// Typography
<h1 className="text-4xl md:text-5xl lg:text-6xl">
<p className="text-base sm:text-lg md:text-xl">

// Touch target
<button className="min-h-[44px] min-w-[44px] px-4">

// Hover (desktop only)
<div className="md:hover:scale-105 active:scale-95">

// Image aspect ratio
<div className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]">
```

---

## Files Reference

### Components
- `ShareButtons.tsx` - Touch targets, responsive sizes
- `PostCard.tsx` - Touch-friendly hovers
- `Navigation.tsx` - Responsive mega menus, touch targets
- `contextual-fab.tsx` - Touch-friendly interactions

### Pages
- `Blog.tsx` - Smart pagination, grid progression
- `BlogPost.tsx` - Responsive images, blockquote padding
- `ForBuyers.tsx` - All responsive patterns demonstrated
- `ForSuppliers.tsx` - Typography scaling, grid systems
- `GetQuotes.tsx` - Form accessibility, touch targets
- `Home.tsx` - Text wrapping, smooth scaling
- `Pricing.tsx` - Table scrolling, grid progression
- `UnitCostCalculator.tsx` - Chart scrolling, table indicators
- `TaxCalculator.tsx` - Grid progression

---

## Support & Maintenance

### When Adding New Components

1. Start with mobile design first
2. Apply touch target minimums (44x44px)
3. Use responsive typography patterns
4. Test at all critical breakpoints
5. Verify accessibility compliance
6. Check performance impact

### Common Issues & Solutions

**Problem**: Text overflow on mobile
**Solution**: Add `break-words` parent, `whitespace-nowrap` to specific terms

**Problem**: Grid too cramped on tablet
**Solution**: Add intermediate `md:grid-cols-3` step

**Problem**: Hover effects trigger on mobile scroll
**Solution**: Use `md:hover:` prefix, add `active:` states

**Problem**: Navigation menu overflows
**Solution**: Use dynamic width calculations with viewport constraints

---

## Version History

**v1.0** (2025-12-15)
- Initial comprehensive responsive design implementation
- 6-phase overhaul completed
- 14 files modified across components and pages
- Lighthouse accessibility: 91/100
- All WCAG AA touch targets met

---

Generated with [Claude Code](https://claude.com/claude-code)
