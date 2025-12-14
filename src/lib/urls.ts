// Cross-domain URL utilities for HoleScale
// Marketing site (holescale.com) links to App (app.holescale.com)

export const APP_URL = import.meta.env.VITE_APP_URL || 'https://app.holescale.com';
export const MARKETING_URL = import.meta.env.VITE_MARKETING_URL || 'https://holescale.com';

// Links to the main application (app.holescale.com)
export const appLinks = {
  login: `${APP_URL}/auth`,
  signup: `${APP_URL}/auth?mode=signup`,
  signupSupplier: `${APP_URL}/auth?mode=signup&type=supplier`,
  signupBuyer: `${APP_URL}/auth?mode=signup&type=buyer`,
  dashboard: `${APP_URL}/dashboard`,
  supplierPortal: `${APP_URL}/supplier`,
  buyerPortal: `${APP_URL}/buyer`,
  admin: `${APP_URL}/admin`,
  settings: `${APP_URL}/settings`,
  messages: `${APP_URL}/messages`,
  orders: `${APP_URL}/orders`,
  rfq: `${APP_URL}/rfq`,
};

// Links within the marketing site (holescale.com)
export const marketingLinks = {
  home: '/',
  blog: '/blog',
  pricing: '/pricing',
  forSuppliers: '/for-suppliers',
  forBuyers: '/for-buyers',
  about: '/about',
  features: '/features',
  howItWorks: '/how-it-works',
  contact: '/contact',
  faq: '/faq',
  resources: '/resources',
  glossary: '/glossary',
  waitlist: '/waitlist',
  investors: '/investors',
  privacy: '/privacy',
  privacyPolicy: '/privacy-policy',
  terms: '/terms',
};

// Helper to build signup link with UTM tracking
export function getSignupLink(options?: {
  type?: 'supplier' | 'buyer';
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmCampaign?: string;
}): string {
  const params = new URLSearchParams();

  if (options?.type) {
    params.set('type', options.type);
  }
  if (options?.utmSource) {
    params.set('utm_source', options.utmSource);
  }
  if (options?.utmMedium) {
    params.set('utm_medium', options.utmMedium);
  }
  if (options?.utmContent) {
    params.set('utm_content', options.utmContent);
  }
  if (options?.utmCampaign) {
    params.set('utm_campaign', options.utmCampaign);
  }

  const queryString = params.toString();
  return `${APP_URL}/auth${queryString ? `?${queryString}` : ''}`;
}

// Helper for blog post CTAs with tracking
export function getBlogCTALink(postSlug: string, audience: 'supplier' | 'buyer'): string {
  return getSignupLink({
    type: audience,
    utmSource: 'blog',
    utmMedium: 'cta',
    utmContent: postSlug,
  });
}
