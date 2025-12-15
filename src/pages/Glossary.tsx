/**
 * Glossary Page
 * Searchable glossary grouped by Corrugated, Flexible, Rigid, Logistics
 */

import { useState, useMemo } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlossarySearch } from '@/components/glossary/GlossarySearch';
import { GlossaryCategory } from '@/components/glossary/GlossaryCategory';
import { getTermsByCategory, searchGlossaryTerms, GLOSSARY_TERMS } from '@/data/glossary';
import type { GlossaryTerm } from '@/data/glossary';
import SEO from '@/components/SEO';
import { generateBreadcrumbSchema, generateCollectionPageSchema } from '@/lib/schema';

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryTerm['category'] | 'all'>('all');

  const filteredTerms = useMemo(() => {
    let terms = searchQuery
      ? searchGlossaryTerms(searchQuery)
      : GLOSSARY_TERMS;

    if (selectedCategory !== 'all') {
      terms = terms.filter((t) => t.category === selectedCategory);
    }

    return terms;
  }, [searchQuery, selectedCategory]);

  const termsByCategory = useMemo(() => {
    const grouped: Record<string, GlossaryTerm[]> = {
      corrugated: [],
      flexible: [],
      rigid: [],
      logistics: [],
      general: [],
    };

    filteredTerms.forEach((term) => {
      grouped[term.category].push(term);
    });

    return grouped;
  }, [filteredTerms]);

  return (
    <main className="flex-1 pb-32">
      <div className="container max-w-7xl py-8 px-4 space-y-6">
        <SEO
          title="Packaging Glossary - HoleScale"
          description="Comprehensive glossary of packaging industry terms including ECT, Mullen, gauge, flute types, RSC boxes, MOQ, and more. Learn packaging terminology used by suppliers and manufacturers."
          keywords="packaging glossary, ECT, Mullen test, corrugated packaging terms, packaging definitions, box terminology, shipping terms"
          canonical="https://holescale.com/glossary"
          schema={[
            generateBreadcrumbSchema([
              { name: 'Home', url: 'https://holescale.com' },
              { name: 'Glossary' },
            ]),
            {
              ...generateCollectionPageSchema(
                'Packaging Glossary',
                'Comprehensive glossary of packaging industry terms and definitions',
                'https://holescale.com/glossary'
              ),
              mainEntity: {
                '@type': 'DefinedTermSet',
                name: 'HoleScale Packaging Glossary',
                description: 'Industry-standard packaging terminology for corrugated, flexible, rigid packaging and logistics.',
              },
            },
          ]}
        />

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-4xl font-bold">Packaging Glossary</h1>
          </div>
          <p className="text-muted-foreground">
            Understand packaging terminology and specifications
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <GlossarySearch
            onTermSelect={(term) => {
              setSearchQuery(term.term);
              setSelectedCategory(term.category);
            }}
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All ({filteredTerms.length})</TabsTrigger>
            <TabsTrigger value="corrugated">
              Corrugated ({termsByCategory.corrugated.length})
            </TabsTrigger>
            <TabsTrigger value="flexible">
              Flexible ({termsByCategory.flexible.length})
            </TabsTrigger>
            <TabsTrigger value="rigid">Rigid ({termsByCategory.rigid.length})</TabsTrigger>
            <TabsTrigger value="logistics">
              Logistics ({termsByCategory.logistics.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {selectedCategory === 'all' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(termsByCategory).map(([category, terms]) => {
                  if (terms.length === 0) return null;
                  return (
                    <GlossaryCategory
                      key={category}
                      category={category as GlossaryTerm['category']}
                      terms={terms}
                    />
                  );
                })}
              </div>
            ) : (
              <GlossaryCategory
                category={selectedCategory}
                terms={termsByCategory[selectedCategory]}
              />
            )}

            {filteredTerms.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No terms found</h3>
                <p className="text-muted-foreground">
                  Try a different search term or category.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
