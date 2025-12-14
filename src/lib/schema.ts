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
