# Comprehensive Analytics Implementation

This document outlines all the detailed analytics tracking that has been implemented for the HoleScale marketing site.

## Overview

The analytics system provides comprehensive tracking across:
- **Google Analytics 4** (GA4) - Primary analytics platform
- **Microsoft Clarity** - User behavior and session recordings
- **Custom Event Tracking** - Detailed interaction tracking
- **E-commerce Tracking** - Subscription conversions
- **Performance Monitoring** - Page load and performance metrics

## Core Analytics Utility

**File**: `src/lib/analytics.ts`

A comprehensive analytics utility that provides:

### 1. Event Tracking
- Custom events with categories, labels, and values
- Automatic deduplication and error handling
- Support for custom parameters

### 2. E-commerce Tracking
- Subscription purchases with full transaction details
- Trial tracking (begin_checkout events)
- Tier-level tracking with pricing information

### 3. Form Tracking
- Form start (when user begins filling)
- Form submission (success/failure)
- Form field interactions (focus, blur, change)
- Error message tracking

### 4. Engagement Tracking
- **Scroll Depth**: Tracks 25%, 50%, 75%, 90%, 100% milestones
- **Time on Page**: Tracks 10s, 30s, 1m, 2m, 5m, 10m milestones
- **Outbound Links**: Automatic tracking of external link clicks
- **File Downloads**: Automatic tracking of PDF, DOC, ZIP, etc.

### 5. Content Tracking
- Blog post views with metadata (author, category, tags)
- Blog engagement (bookmarks, shares, comments, read completion)
- Resource downloads with form requirement tracking

### 6. Conversion Tracking
- Waitlist signups with role, referral source, company size
- Pricing tier views and clicks
- Tool usage tracking
- Subscription conversions

### 7. Error Tracking
- JavaScript errors with stack traces
- Promise rejections
- Error source identification

### 8. Performance Tracking
- DNS lookup time
- TCP connection time
- Request/response times
- DOM processing time
- Total load time
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)

### 9. User Journey Tracking
- Journey step tracking
- Step numbering and naming
- Journey name identification

## React Hooks

**File**: `src/hooks/useAnalytics.ts`

### `usePageTracking(customParams?)`
Automatically tracks page views on route changes with enhanced metadata.

### `useScrollTracking(enabled?)`
Tracks scroll depth milestones for a specific page.

### `useTimeOnPageTracking(enabled?)`
Tracks time on page milestones.

### `useAnalyticsInit()`
Initializes automatic tracking for common interactions.

### `useFormTracking(formName, formLocation?)`
Provides form tracking helpers:
- `trackStart()` - Call when user begins filling form
- `trackSubmit(success, errorMessage?)` - Call on form submission
- `trackFieldInteraction(fieldName, interactionType)` - Track field interactions

## Integrated Components

### 1. App Component (`src/App.tsx`)
- **AnalyticsWrapper**: Initializes analytics and tracks all page views
- Automatic page view tracking on route changes

### 2. Waitlist Form (`src/components/waitlist/WaitlistForm.tsx`)
- Tracks form start when user begins interacting
- Tracks form submission (success/failure)
- Tracks waitlist signup conversion with:
  - Role (buyer/supplier)
  - Referral source
  - Company size

### 3. Contact Form (`src/pages/Contact.tsx`)
- Tracks form start and submission
- Tracks success/failure with error messages

### 4. Pricing Page (`src/pages/Pricing.tsx`)
- Tracks page view with content groups
- Tracks pricing tier views when tiers are loaded
- Tracks pricing tier clicks (subscribe button clicks)
- Tracks user type selection (buyer/supplier)

### 5. Blog Post Page (`src/pages/BlogPost.tsx`)
- Tracks blog post view with:
  - Post ID, title
  - Author name
  - Category
  - Tags
- Tracks scroll depth
- Tracks time on page

### 6. Checkout Success (`src/pages/CheckoutSuccess.tsx`)
- Tracks subscription conversion with:
  - Tier name
  - Price
  - Currency
  - Trial status

### 7. Resources Page (`src/pages/Resources.tsx`)
- Tracks page view
- Tracks resource downloads with:
  - Resource name
  - Resource type/category
  - Form requirement status

## Automatic Tracking

The analytics system automatically tracks:

1. **Outbound Links**: All clicks to external domains
2. **File Downloads**: PDF, DOC, XLS, ZIP, etc. files
3. **Scroll Depth**: Milestones at 25%, 50%, 75%, 90%, 100%
4. **Time on Page**: Milestones at 10s, 30s, 1m, 2m, 5m, 10m
5. **Page Performance**: Load times, FCP, LCP
6. **JavaScript Errors**: All unhandled errors and promise rejections

## Event Categories

All events are organized into categories for easy filtering in GA4:

- **Form**: Form interactions
- **Conversion**: Key conversion events
- **Engagement**: User engagement metrics
- **Blog**: Blog-related events
- **Resource**: Resource downloads
- **Pricing**: Pricing page interactions
- **Subscription**: Subscription-related events
- **Tool**: Tool usage
- **Error**: Error tracking
- **Performance**: Performance metrics
- **User Journey**: User journey steps
- **Outbound Link**: External link clicks
- **Download**: File downloads

## Google Analytics 4 Setup

The tracking code is configured with:

- **Measurement ID**: `G-XSYCKL5VZW`
- **Deferred Loading**: Analytics load after page is interactive (2s delay)
- **Error Handling**: Graceful failures with console warnings
- **Content Groups**: Enhanced page organization for reporting

## Microsoft Clarity Setup

- **Project ID**: `uh3i6gs4dy`
- **Deferred Loading**: Loads after page is interactive
- **Error Handling**: Graceful failures

## Key Metrics Tracked

### Conversion Funnel
1. **Page View** → User visits page
2. **Form Start** → User begins filling form
3. **Form Submit** → User submits form
4. **Waitlist Signup** → User joins waitlist
5. **Pricing Tier View** → User views pricing tier
6. **Pricing Tier Click** → User clicks subscribe
7. **Subscription** → User completes subscription

### Engagement Metrics
- Scroll depth (25%, 50%, 75%, 90%, 100%)
- Time on page (10s, 30s, 1m, 2m, 5m, 10m)
- Blog reading completion
- Resource downloads
- Tool usage

### Performance Metrics
- DNS lookup time
- TCP connection time
- Request/response times
- DOM processing time
- Total load time
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)

## Usage Examples

### Track Custom Event
```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent({
  event_name: 'button_click',
  event_category: 'Navigation',
  event_label: 'Header CTA',
  button_text: 'Get Started',
});
```

### Track Subscription
```typescript
import { trackSubscription } from '@/lib/analytics';

trackSubscription('Professional', 49, 'USD', true); // true = is trial
```

### Track Blog View
```typescript
import { trackBlogView } from '@/lib/analytics';

trackBlogView(
  'post-123',
  'How to Choose Packaging Suppliers',
  'John Doe',
  'Procurement',
  ['packaging', 'suppliers', 'B2B']
);
```

### Use Form Tracking Hook
```typescript
import { useFormTracking } from '@/hooks/useAnalytics';

const { trackStart, trackSubmit } = useFormTracking('contact', '/contact');

// Call trackStart() when user begins filling
// Call trackSubmit(true) on success, trackSubmit(false, errorMessage) on failure
```

## Content Groups

Pages are organized into content groups for better reporting:

- **content_group1**: Section (e.g., "Marketing", "Blog", "Resources")
- **content_group2**: Category (e.g., "Pricing", "Features", "Blog Category")
- **content_group3**: Subcategory
- **content_group4**: Author/Tag
- **content_group5**: Custom metadata

## Privacy & Performance

- **Deferred Loading**: Analytics scripts load after page is interactive
- **Non-blocking**: Analytics never blocks page rendering
- **Error Handling**: All tracking failures are handled gracefully
- **No PII**: No personally identifiable information is tracked
- **GDPR Compliant**: Respects user privacy preferences

## Next Steps

To view your analytics data:

1. **Google Analytics 4**:
   - Visit [analytics.google.com](https://analytics.google.com)
   - Navigate to your property
   - View Events, Conversions, Engagement, and Performance reports

2. **Microsoft Clarity**:
   - Visit [clarity.microsoft.com](https://clarity.microsoft.com)
   - View session recordings, heatmaps, and insights

3. **Custom Reports**:
   - Create custom reports in GA4 using the event categories
   - Set up conversion goals for key events
   - Create funnels to track user journeys

## Troubleshooting

If analytics aren't working:

1. Check browser console for warnings
2. Verify analytics scripts are loading (Network tab)
3. Check if `window.gtag` and `window.clarity` are defined
4. Verify CSP headers allow analytics domains
5. Check for ad blockers that might block analytics

## Support

For questions or issues with analytics:
- Check the analytics utility code in `src/lib/analytics.ts`
- Review hook implementations in `src/hooks/useAnalytics.ts`
- Check component integrations for examples

