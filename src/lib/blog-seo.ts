// ============================================================================
// HOLESCALE BLOG - SEO UTILITIES
// JSON-LD schema generators for blog content
// ============================================================================

import type { BlogPost, BlogPostCard, Author, Category } from '@/types/blog';

const SITE_URL = 'https://www.holescale.com';
const SITE_NAME = 'HoleScale';
const LOGO_URL = 'https://www.holescale.com/logo.png';

// -----------------------------------------------------------------------------
// Blog Post Schema (Article/BlogPosting)
// -----------------------------------------------------------------------------

export function generateBlogPostSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage.src,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${SITE_URL}/blog/author/${post.author.slug}`,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    articleSection: post.category.name,
    keywords: post.seo?.keywords?.join(', ') || '',
    wordCount: post.readingProgress.wordCount,
    timeRequired: `PT${post.readingProgress.estimatedReadTime}M`,
  };
}

// -----------------------------------------------------------------------------
// Breadcrumb Schema
// -----------------------------------------------------------------------------

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// -----------------------------------------------------------------------------
// Blog List Schema
// -----------------------------------------------------------------------------

export function generateBlogListSchema(posts: BlogPostCard[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'HoleScale Blog',
    description: 'Expert insights on packaging, procurement, and B2B sourcing',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      image: post.featuredImage.src,
    })),
  };
}

// -----------------------------------------------------------------------------
// Author Schema
// -----------------------------------------------------------------------------

export function generateAuthorSchema(author: Author) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `${SITE_URL}/blog/author/${author.slug}`,
    image: author.avatar,
    description: author.bio,
    jobTitle: author.role,
    worksFor: {
      '@type': 'Organization',
      name: author.company || SITE_NAME,
    },
    sameAs: [
      author.social?.twitter ? `https://twitter.com/${author.social.twitter}` : null,
      author.social?.linkedin || null,
      author.social?.website || null,
    ].filter(Boolean),
  };
}

// -----------------------------------------------------------------------------
// Category/Tag Collection Schema
// -----------------------------------------------------------------------------

export function generateCollectionSchema(
  type: 'category' | 'tag',
  item: { name: string; slug: string; description?: string },
  postCount: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${item.name} - HoleScale Blog`,
    description: item.description || `Articles about ${item.name}`,
    url: `${SITE_URL}/blog/${type}/${item.slug}`,
    numberOfItems: postCount,
    isPartOf: {
      '@type': 'Blog',
      name: 'HoleScale Blog',
      url: `${SITE_URL}/blog`,
    },
  };
}

// -----------------------------------------------------------------------------
// FAQ Schema (for articles with FAQ sections)
// -----------------------------------------------------------------------------

interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// -----------------------------------------------------------------------------
// Helper: Generate all schemas for a blog post page
// -----------------------------------------------------------------------------

export function generateBlogPostSchemas(post: BlogPost) {
  const breadcrumbs = [
    { name: 'Home', url: SITE_URL },
    { name: 'Blog', url: `${SITE_URL}/blog` },
    { name: post.category.name, url: `${SITE_URL}/blog/category/${post.category.slug}` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
  ];

  return [
    generateBlogPostSchema(post),
    generateBreadcrumbSchema(breadcrumbs),
  ];
}

// -----------------------------------------------------------------------------
// Meta Tag Helpers
// -----------------------------------------------------------------------------

export function getBlogPostMetaTags(post: BlogPost) {
  return {
    title: post.seo?.metaTitle || `${post.title} | HoleScale Blog`,
    description: post.seo?.metaDescription || post.excerpt,
    canonical: post.seo?.canonicalUrl || `${SITE_URL}/blog/${post.slug}`,
    ogImage: post.seo?.ogImage || post.featuredImage.src,
    ogType: 'article',
    articlePublishedTime: post.publishedAt,
    articleModifiedTime: post.updatedAt || post.publishedAt,
    articleAuthor: post.author.name,
    articleSection: post.category.name,
    keywords: post.seo?.keywords?.join(', '),
  };
}

export function getCategoryMetaTags(category: Category) {
  return {
    title: `${category.name} Articles | HoleScale Blog`,
    description: category.description || `Browse ${category.postCount} articles about ${category.name} on the HoleScale Blog.`,
    canonical: `${SITE_URL}/blog/category/${category.slug}`,
  };
}

export function getAuthorMetaTags(author: Author) {
  return {
    title: `${author.name} - Author | HoleScale Blog`,
    description: `${author.bio?.slice(0, 155) || `Read articles by ${author.name}, ${author.role} at ${author.company || 'HoleScale'}.`}`,
    canonical: `${SITE_URL}/blog/author/${author.slug}`,
  };
}
