/**
 * Individual Glossary Term Page
 * SEO-optimized page for each packaging term with DefinedTerm schema
 */

import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronRight, BookOpen, ArrowRight, Tag } from 'lucide-react';
import SEO from '@/components/SEO';
import { generateBreadcrumbSchema, generateDefinedTermSchema } from '@/lib/schema';
import { findGlossaryTermBySlug, getRelatedTerms, getCategoryDisplayName } from '@/data/glossary';
import { WhatIsHoleScale } from '@/components/marketing/WhatIsHoleScale';
import { TLDRBlock } from '@/components/ui/TLDRBlock';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FadeIn';

export default function GlossaryTermPage() {
  const { slug } = useParams<{ slug: string }>();
  const term = slug ? findGlossaryTermBySlug(slug) : null;

  if (!term) {
    return <Navigate to="/glossary" replace />;
  }

  const relatedTerms = getRelatedTerms(term);
  const categoryName = getCategoryDisplayName(term.category);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://holescale.com' },
    { name: 'Glossary', url: 'https://holescale.com/glossary' },
    { name: term.term },
  ]);

  const definedTermSchema = generateDefinedTermSchema({
    name: term.term,
    definition: term.definition,
    slug: term.slug,
    category: categoryName,
  });

  return (
    <main className="flex-1 pb-32">
      <SEO
        title={`${term.term} - Packaging Glossary | HoleScale`}
        description={term.definition}
        keywords={`${term.term}, ${term.aliases?.join(', ') || ''}, packaging terminology, ${categoryName.toLowerCase()}`}
        canonical={`https://holescale.com/glossary/${term.slug}`}
        schema={[breadcrumbSchema, definedTermSchema]}
      />

      <div className="container max-w-4xl py-8 px-4">
        {/* Breadcrumb */}
        <FadeIn>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/glossary" className="hover:text-foreground transition-colors">Glossary</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{term.term}</span>
          </nav>
        </FadeIn>

        {/* Header */}
        <FadeIn delay={100}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {categoryName}
              </span>
              {term.aliases && term.aliases.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  Also known as: {term.aliases.join(', ')}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{term.term}</h1>
          </div>
        </FadeIn>

        {/* TL;DR / Definition */}
        <FadeIn delay={200}>
          <TLDRBlock variant="prominent">
            <p className="text-lg leading-relaxed">
              <strong>Definition:</strong> {term.definition}
            </p>
          </TLDRBlock>
        </FadeIn>

        {/* Example (if available) */}
        {term.example && (
          <FadeIn delay={300}>
            <div className="bg-muted/50 rounded-lg p-5 border border-border mb-8">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Example
              </h2>
              <p className="text-muted-foreground">{term.example}</p>
            </div>
          </FadeIn>
        )}

        {/* Related Terms */}
        {relatedTerms.length > 0 && (
          <FadeIn delay={400}>
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Related Terms
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedTerms.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/glossary/${related.slug}`}
                    className="group flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div>
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {related.term}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {related.definition.slice(0, 60)}...
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* CTA */}
        <FadeIn delay={500}>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 md:p-8 border border-primary/20 mb-10">
            <h2 className="text-xl font-semibold mb-2">
              Looking for {term.term.toLowerCase().includes('packaging') ? term.term : `${term.term} packaging`} suppliers?
            </h2>
            <p className="text-muted-foreground mb-4">
              HoleScale connects you with verified packaging suppliers. Get competitive quotes in 24-48 hours.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/waitlist">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/glossary">
                  Browse All Terms
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* What is HoleScale */}
        <FadeIn delay={600}>
          <WhatIsHoleScale variant="default" showCTA={false} />
        </FadeIn>

        {/* Back to Glossary */}
        <FadeIn delay={700}>
          <div className="mt-10 pt-6 border-t border-border">
            <Link
              to="/glossary"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Glossary
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
