import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  schema?: object | object[]; // JSON-LD schema(s)
  noindex?: boolean;
  siteName?: string;
}

const SEO = ({ 
  title, 
  description, 
  keywords = 'B2B marketplace, bulk packaging materials, custom packaging suppliers, corrugated boxes wholesale, packaging materials USA, custom boxes, shipping supplies, mailers, poly bags, food packaging, labels, sustainable packaging, packaging procurement',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonical,
  schema,
  noindex = false,
  siteName = 'HoleScale'
}: SEOProps) => {
  const siteUrl = 'https://holescale.com';
  const fullTitle = title.includes('|') ? title : `${title} | HoleScale`;
  // Get pathname safely (client-side only)
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const fullCanonical = canonical || `${siteUrl}${pathname}`;
  
  // Handle multiple schemas or single schema
  const schemas = Array.isArray(schema) ? schema : schema ? [schema] : [];
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* JSON-LD Schema Markup */}
      {schemas.map((schemaData, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      ))}
    </Helmet>
  );
};

export default SEO;
