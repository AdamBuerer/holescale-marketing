// Schema.org structured data utilities for SEO

export interface OrganizationSchema {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  url: string
  logo?: string
  description?: string
  sameAs?: string[]
}

export interface WebPageSchema {
  '@context': 'https://schema.org'
  '@type': 'WebPage'
  name: string
  description?: string
  url?: string
}

export interface AboutPageSchema {
  '@context': 'https://schema.org'
  '@type': 'AboutPage'
  name: string
  description?: string
  url?: string
}

export interface ContactPageSchema {
  '@context': 'https://schema.org'
  '@type': 'ContactPage'
  name: string
  description?: string
  url?: string
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: {
    '@type': 'ListItem'
    position: number
    name: string
    item?: string
  }[]
}

export interface FAQPageSchema {
  '@context': 'https://schema.org'
  '@type': 'FAQPage'
  mainEntity: {
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }[]
}

export interface ArticleSchema {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  description?: string
  author?: {
    '@type': 'Person' | 'Organization'
    name: string
  }
  datePublished?: string
  dateModified?: string
  image?: string
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HoleScale',
    url: 'https://holescale.com',
    logo: 'https://holescale.com/logo.png',
    description: 'B2B marketplace for custom packaging solutions',
    sameAs: [
      'https://linkedin.com/company/holescale',
      'https://twitter.com/holescale',
    ],
  }
}

export function generateWebPageSchema(name = 'HoleScale', description?: string, url?: string): WebPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
  }
}

export function generateAboutPageSchema(name = 'About HoleScale', description = 'Learn about HoleScale\'s mission to revolutionize packaging procurement', url = 'https://holescale.com/about'): AboutPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name,
    description,
    url,
  }
}

export function generateContactPageSchema(name = 'Contact HoleScale', description = 'Get in touch with the HoleScale team', url = 'https://holescale.com/contact'): ContactPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name,
    description,
    url,
  }
}

export function generateBreadcrumbSchema(items: { name: string; url?: string }[]): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateArticleSchema(options: {
  headline: string
  description?: string
  author?: string
  datePublished?: string
  dateModified?: string
  image?: string
}): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    author: options.author ? {
      '@type': 'Organization',
      name: options.author,
    } : undefined,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    image: options.image,
  }
}

export function generateWebSiteSchema(name = 'HoleScale', description?: string, url = 'https://holescale.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url,
  }
}

export function generateItemListSchema(items: { name: string; description?: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      description: item.description,
      url: item.url,
    })),
  }
}

export function generateHowToSchema(steps: { name: string; text: string }[], name?: string, description?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

export function generateCollectionPageSchema(name = 'Resources', description?: string, url?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
  }
}

// LocalBusiness schema for company location/headquarters
export interface LocalBusinessSchema {
  '@context': 'https://schema.org'
  '@type': 'LocalBusiness'
  name: string
  description?: string
  url?: string
  logo?: string
  image?: string
  telephone?: string
  email?: string
  address?: {
    '@type': 'PostalAddress'
    addressLocality?: string
    addressRegion?: string
    addressCountry?: string
    postalCode?: string
    streetAddress?: string
  }
  geo?: {
    '@type': 'GeoCoordinates'
    latitude?: number
    longitude?: number
  }
  priceRange?: string
  openingHours?: string
  sameAs?: string[]
}

export function generateLocalBusinessSchema(options?: {
  name?: string
  description?: string
  telephone?: string
  email?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  streetAddress?: string
}): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: options?.name ?? 'HoleScale',
    description: options?.description ?? 'B2B marketplace for custom packaging solutions connecting buyers with verified suppliers across the United States.',
    url: 'https://holescale.com',
    logo: 'https://holescale.com/logo.png',
    telephone: options?.telephone,
    email: options?.email ?? 'info@holescale.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: options?.addressLocality ?? 'Colorado',
      addressRegion: options?.addressRegion ?? 'CO',
      addressCountry: 'US',
      postalCode: options?.postalCode,
      streetAddress: options?.streetAddress,
    },
    priceRange: 'Free for buyers',
    sameAs: [
      'https://linkedin.com/company/holescale',
      'https://twitter.com/holescale',
    ],
  }
}

// AggregateOffer schema for pricing information
export interface AggregateOfferSchema {
  '@context': 'https://schema.org'
  '@type': 'AggregateOffer'
  priceCurrency: string
  lowPrice?: string | number
  highPrice?: string | number
  offerCount?: number
  offers?: {
    '@type': 'Offer'
    name: string
    description?: string
    price: string | number
    priceCurrency: string
    priceSpecification?: {
      '@type': 'PriceSpecification'
      price: string | number
      priceCurrency: string
      unitText?: string
    }
  }[]
}

export function generateAggregateOfferSchema(offers: {
  name: string
  description?: string
  price: string | number
  unitText?: string
}[]): AggregateOfferSchema {
  const prices = offers.map(o => typeof o.price === 'string' ? parseFloat(o.price) || 0 : o.price)
  const validPrices = prices.filter(p => p > 0)

  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: validPrices.length > 0 ? Math.min(...validPrices) : 0,
    highPrice: validPrices.length > 0 ? Math.max(...validPrices) : undefined,
    offerCount: offers.length,
    offers: offers.map(offer => ({
      '@type': 'Offer',
      name: offer.name,
      description: offer.description,
      price: offer.price,
      priceCurrency: 'USD',
      priceSpecification: offer.unitText ? {
        '@type': 'PriceSpecification',
        price: offer.price,
        priceCurrency: 'USD',
        unitText: offer.unitText,
      } : undefined,
    })),
  }
}

// DefinedTerm schema for glossary terms
export interface DefinedTermSchema {
  '@context': 'https://schema.org'
  '@type': 'DefinedTerm'
  name: string
  description: string
  inDefinedTermSet?: {
    '@type': 'DefinedTermSet'
    name: string
    url?: string
  }
  termCode?: string
  url?: string
}

export function generateDefinedTermSchema(term: {
  name: string
  definition: string
  slug?: string
  category?: string
}): DefinedTermSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.name,
    description: term.definition,
    url: term.slug ? `https://holescale.com/glossary/${term.slug}` : undefined,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: term.category ?? 'HoleScale Packaging Glossary',
      url: 'https://holescale.com/glossary',
    },
  }
}

// SoftwareApplication schema for the platform
export interface SoftwareApplicationSchema {
  '@context': 'https://schema.org'
  '@type': 'SoftwareApplication'
  name: string
  description?: string
  url?: string
  applicationCategory?: string
  operatingSystem?: string
  offers?: {
    '@type': 'Offer'
    price: string | number
    priceCurrency: string
    description?: string
  }
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: number
    ratingCount: number
    bestRating?: number
    worstRating?: number
  }
  featureList?: string[]
  screenshot?: string | string[]
}

export function generateSoftwareApplicationSchema(options?: {
  description?: string
  features?: string[]
  screenshot?: string | string[]
}): SoftwareApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HoleScale',
    description: options?.description ?? 'B2B packaging marketplace connecting buyers with verified packaging suppliers. Get competitive quotes in 24-48 hours.',
    url: 'https://holescale.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free for buyers. Suppliers pay per qualified lead.',
    },
    featureList: options?.features ?? [
      'RFQ Management',
      'Verified Supplier Network',
      'Competitive Quoting',
      'Real-time Communication',
      'Order Tracking',
      'Quality Assurance',
    ],
    screenshot: options?.screenshot,
  }
}
