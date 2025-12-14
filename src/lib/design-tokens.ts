/**
 * HoleScale Design Tokens
 * -----------------------------------------------------------------------------
 * Central source of truth for typography, spacing, colors, and component styles.
 * Import from this file (or from `src/lib/theme.ts`) instead of hardcoding
 * values so the admin experience stays visually consistent.
 *
 * CRITICAL RULE: Never use arbitrary values in components
 * ALWAYS reference these tokens
 *
 * Updated: December 4, 2025 - Enhanced with comprehensive Tailwind-compatible scale
 */

export const FONT_FAMILY =
  "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

export const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const FONT_SIZES = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px",
  "4xl": "36px",
} as const;

export const TYPOGRAPHY = {
  h1: { size: "36px", weight: FONT_WEIGHTS.bold, lineHeight: 1.2 },
  h2: { size: "24px", weight: FONT_WEIGHTS.semibold, lineHeight: 1.3 },
  h3: { size: "18px", weight: FONT_WEIGHTS.semibold, lineHeight: 1.35 },
  cardTitle: { size: "15px", weight: FONT_WEIGHTS.medium, lineHeight: 1.4 },
  body: { size: "14px", weight: FONT_WEIGHTS.regular, lineHeight: 1.5 },
  bodySm: { size: "13px", weight: FONT_WEIGHTS.regular, lineHeight: 1.45 },
  caption: { size: "12px", weight: FONT_WEIGHTS.regular, lineHeight: 1.4 },
} as const;

/**
 * ENHANCED SPACING SCALE - Tailwind Compatible
 * 4px base scale for consistency
 *
 * Migration notes:
 * - SPACING.xs (4px) → spacing[1]
 * - SPACING.sm (8px) → spacing[2]
 * - SPACING.md (12px) → spacing[3]
 * - SPACING.lg (16px) → spacing[4]
 * - SPACING.xl (24px) → spacing[6]
 * - SPACING["2xl"] (32px) → spacing[8]
 * - SPACING["3xl"] (48px) → spacing[12]
 * - SPACING["4xl"] (64px) → spacing[16]
 */
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px - SPACING.xs
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px - SPACING.sm
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px - SPACING.md
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px - SPACING.lg
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px - SPACING.xl
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px - SPACING["2xl"]
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px - SPACING["3xl"]
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px - SPACING["4xl"]
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// Legacy SPACING export - kept for backward compatibility
export const SPACING = {
  xs: spacing[1],     // "4px"
  sm: spacing[2],     // "8px"
  md: spacing[3],     // "12px"
  lg: spacing[4],     // "16px"
  xl: spacing[6],     // "24px"
  "2xl": spacing[8],  // "32px"
  "3xl": spacing[12], // "48px"
  "4xl": spacing[16], // "64px"
} as const;

/**
 * Border Radius Scale
 * Defines standard corner rounding values
 */
export const borderRadius = {
  none: '0',
  sm: '0.125rem',     // 2px - subtle rounding
  DEFAULT: '0.25rem', // 4px - default
  md: '0.375rem',     // 6px - medium
  lg: '0.5rem',       // 8px - large (cards)
  xl: '0.75rem',      // 12px - extra large
  '2xl': '1rem',      // 16px - very round
  '3xl': '1.5rem',    // 24px - super round
  full: '9999px',     // pill/circle
} as const;

// Legacy exports - kept for backward compatibility
export const BORDER_RADIUS = {
  xs: borderRadius.sm,      // "4px" → 2px (closest)
  sm: borderRadius.md,      // "6px"
  md: borderRadius.lg,      // "8px"
  lg: borderRadius.xl,      // "12px"
  xl: borderRadius['2xl'],  // "16px"
  full: borderRadius.full,  // "9999px"
} as const;

export const RADIUS_CLASSES = {
  xs: "rounded-sm",
  sm: "rounded",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
} as const;

export const SHADOWS = {
  subtle: "0 1px 3px rgba(15, 23, 42, 0.12)",
  medium: "0 8px 24px rgba(15, 23, 42, 0.12)",
  focus: "0 0 0 3px rgba(37, 99, 235, 0.35)",
} as const;

export const ICON_SIZES = {
  sidebar: "20px",
  card: "24px",
  badge: "16px",
} as const;

export const COLOR_PALETTE = {
  primary: "hsl(var(--primary))",
  primaryForeground: "hsl(var(--primary-foreground))",
  secondary: "hsl(var(--secondary))",
  secondaryForeground: "hsl(var(--secondary-foreground))",
  muted: "hsl(var(--muted))",
  mutedForeground: "hsl(var(--muted-foreground))",
  success: "hsl(var(--success))",
  successForeground: "hsl(var(--success-foreground))",
  warning: "hsl(var(--warning))",
  warningForeground: "hsl(var(--warning-foreground))",
  destructive: "hsl(var(--destructive))",
  destructiveForeground: "hsl(var(--destructive-foreground))",
  neutral: {
    50: "hsl(var(--neutral-50))",
    100: "hsl(var(--neutral-100))",
    200: "hsl(var(--neutral-200))",
    300: "hsl(var(--neutral-300))",
    400: "hsl(var(--neutral-400))",
    500: "hsl(var(--neutral-500))",
    600: "hsl(var(--neutral-600))",
    700: "hsl(var(--neutral-700))",
    900: "hsl(var(--neutral-900))",
  },
} as const;

export const COMPONENT_STYLES = {
  cards: {
    padding: SPACING.xl,
    radius: BORDER_RADIUS.lg,
    minHeight: "220px",
    statValueSize: "48px",
    gap: SPACING.md,
  },
  sidebar: {
    sectionSpacingTop: SPACING["2xl"],
    sectionSpacingBottom: SPACING.md,
    sectionDividerOpacity: 0.1,
    itemPaddingX: SPACING.lg,
    itemPaddingY: SPACING.sm,
    iconSize: ICON_SIZES.sidebar,
  },
  header: {
    height: "80px",
    controlHeight: "40px",
    gap: SPACING.lg,
  },
  tooltip: {
    maxWidth: "280px",
  },
} as const;

export const ANIMATION = {
  fast: "150ms",
  default: "200ms",
  slow: "300ms",
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

/**
 * ENHANCED EXPORTS FOR TAILWIND INTEGRATION
 * These provide Tailwind-compatible scales for the config
 */

/**
 * Tailwind-compatible fontSize scale with line heights
 */
export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  '5xl': ['3rem', { lineHeight: '1' }],         // 48px
  '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
  '7xl': ['4.5rem', { lineHeight: '1' }],       // 72px
  '8xl': ['6rem', { lineHeight: '1' }],         // 96px
  '9xl': ['8rem', { lineHeight: '1' }],         // 128px
} as const;

/**
 * Box Shadow Scale (Tailwind-compatible)
 */
export const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

/**
 * Breakpoints for responsive design
 */
export const breakpoints = {
  sm: '640px',   // Mobile landscape, small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
} as const;

/**
 * Semantic Component Spacing
 * Pre-defined spacing for specific component types
 */
export const componentSpacing = {
  button: {
    sm: { x: spacing[3], y: spacing[1.5] },   // Small buttons: 12px x 6px
    md: { x: spacing[4], y: spacing[2] },      // Default buttons: 16px x 8px
    lg: { x: spacing[6], y: spacing[3] },      // Large buttons: 24px x 12px
  },
  card: {
    padding: spacing[6],           // Standard card padding (24px)
    paddingSm: spacing[4],          // Small card padding (16px)
    gap: spacing[4],                // Gap between card elements (16px)
    borderRadius: borderRadius.lg,  // Card border radius (8px)
  },
  form: {
    fieldGap: spacing[4],           // Gap between form fields (16px)
    labelGap: spacing[2],           // Gap between label and input (8px)
    sectionGap: spacing[8],         // Gap between form sections (32px)
  },
  layout: {
    sidebarWidth: spacing[64],           // Sidebar width (256px)
    sidebarWidthCollapsed: spacing[20],  // Collapsed sidebar (80px)
    headerHeight: spacing[16],           // Header height (64px)
    contentPadding: spacing[8],          // Main content padding (32px)
    contentPaddingMobile: spacing[4],    // Mobile content padding (16px)
  },
  list: {
    itemGap: spacing[2],            // Gap between list items (8px)
    itemPadding: spacing[4],        // Padding within list items (16px)
  },
  grid: {
    gapSm: spacing[2],              // Tight grid gap (8px)
    gapMd: spacing[4],              // Default grid gap (16px)
    gapLg: spacing[6],              // Loose grid gap (24px)
  },
} as const;

/**
 * Animation Durations
 */
export const duration = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
} as const;

/**
 * Animation Easing Functions
 */
export const easing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

/**
 * TypeScript Types for Design Tokens
 */
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type FontSize = keyof typeof fontSize;
export type BoxShadow = keyof typeof boxShadow;
export type Breakpoint = keyof typeof breakpoints;
export type ZIndex = keyof typeof Z_INDEX;
export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;

export const DESIGN_TOKENS = {
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  RADIUS_CLASSES,
  SHADOWS,
  ICON_SIZES,
  COLOR_PALETTE,
  COMPONENT_STYLES,
  ANIMATION,
  Z_INDEX,
} as const;

export const layout = {
  dashboard: "container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-7xl",
  page: "container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-5xl",
  section: "space-y-6",
} as const;

