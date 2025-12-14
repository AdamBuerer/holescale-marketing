import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FadeIn';
import { useMarketingPageShell } from "@/hooks/useMarketingPageShell";
import { useBlogPosts, useBlogCategories, useFeaturedPosts } from '@/hooks/useBlogData';
import { PostGrid } from '@/components/blog/PostGrid';
import { PostCard } from '@/components/blog/PostCard';
import { generateBlogListSchema, generateBreadcrumbSchema } from '@/lib/blog-seo';

export default function Blog() {
  useMarketingPageShell({ className: "space-y-14" });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useBlogCategories();
  const { data: featuredData } = useFeaturedPosts(1);
  const { data: postsData, isLoading } = useBlogPosts({
    page,
    pageSize: 9,
    categorySlug: activeCategory || undefined,
  });

  const categories = categoriesData || [];
  const featuredPost = featuredData?.[0];
  const posts = postsData?.data || [];
  const pagination = postsData?.pagination;

  const breadcrumbs = [
    { name: 'Home', url: 'https://www.holescale.com' },
    { name: 'Blog', url: 'https://www.holescale.com/blog' },
  ];

  const schemas = [
    generateBlogListSchema(posts),
    generateBreadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <SEO
        title="Blog | Packaging & Procurement Insights | HoleScale"
        description="Expert advice on packaging, B2B procurement, and supplier management. Tips, guides, and industry insights for buyers and suppliers."
        canonical="https://www.holescale.com/blog"
        schema={schemas}
      />

      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
              Blog & Resources
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground">
              Expert insights on packaging, procurement, and B2B sourcing strategies
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && !activeCategory && (
        <section className="py-8 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Featured Article
              </h2>
              <PostCard post={featuredPost} variant="featured" />
            </FadeIn>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-8 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              className="rounded-full"
              onClick={() => {
                setActiveCategory(null);
                setPage(1);
              }}
            >
              All Posts
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.slug ? "default" : "outline"}
                className="rounded-full"
                onClick={() => {
                  setActiveCategory(category.slug);
                  setPage(1);
                }}
                style={
                  activeCategory === category.slug
                    ? { backgroundColor: category.color }
                    : undefined
                }
              >
                {category.name}
                <span className="ml-1 text-xs opacity-70">({category.postCount})</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeCategory && (
            <FadeIn>
              <div className="mb-8">
                <h2 className="text-2xl font-bold">
                  {categories.find((c) => c.slug === activeCategory)?.name || 'Posts'}
                </h2>
                <p className="text-muted-foreground">
                  {categories.find((c) => c.slug === activeCategory)?.description}
                </p>
              </div>
            </FadeIn>
          )}

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted rounded-xl mb-4" />
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-6 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found in this category.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveCategory(null)}
              >
                View All Posts
              </Button>
            </div>
          ) : (
            <>
              <PostGrid
                posts={activeCategory ? posts : posts.filter((p) => p.id !== featuredPost?.id)}
              />

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold mb-4">
              Get Packaging Insights in Your Inbox
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Weekly tips on procurement, packaging trends, and sourcing strategies
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <Button type="submit" size="lg">
                Subscribe
              </Button>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* Browse by Topic */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-bold mb-8 text-center">Browse by Topic</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/blog/category/${category.slug}`}
                  className="p-6 bg-card rounded-xl border hover:border-primary/50 hover:shadow-lg transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {category.postCount} articles
                  </p>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
