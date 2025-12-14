import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, TrendingUp, BookOpen, Users, Lightbulb } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeIn } from '@/components/ui/FadeIn';
import { useMarketingPageShell } from "@/hooks/useMarketingPageShell";
import { useBlogPosts, useBlogCategories, useFeaturedPosts } from '@/hooks/useBlogData';
import { PostGrid } from '@/components/blog/PostGrid';
import { PostCard } from '@/components/blog/PostCard';
import { generateBlogListSchema, generateBreadcrumbSchema } from '@/lib/blog-seo';

const categoryIcons: Record<string, React.ElementType> = {
  'industry-insights': TrendingUp,
  'supplier-success': Users,
  'buyer-guides': BookOpen,
  'platform-updates': Lightbulb,
};

export default function Blog() {
  useMarketingPageShell({ className: "space-y-0" });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm mb-6">
                <BookOpen className="w-4 h-4" />
                Insights & Resources
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                Packaging & Procurement{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Insights
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Expert advice, industry trends, and actionable strategies for packaging buyers and suppliers
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 rounded-xl focus:bg-white/20 focus:border-white/40"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => {
                setActiveCategory(null);
                setPage(1);
              }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === null
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug] || BookOpen;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.slug);
                    setPage(1);
                  }}
                  className={`flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.slug
                      ? 'text-white shadow-md'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                  }`}
                  style={
                    activeCategory === category.slug
                      ? { backgroundColor: category.color }
                      : undefined
                  }
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && !activeCategory && (
        <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Featured Article
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <PostCard post={featuredPost} variant="featured" />
            </FadeIn>
          </div>
        </section>
      )}

      {/* Category Header */}
      {activeCategory && (
        <section className="py-8 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${categories.find(c => c.slug === activeCategory)?.color}20` }}
                >
                  {(() => {
                    const Icon = categoryIcons[activeCategory] || BookOpen;
                    return <Icon className="w-7 h-7" style={{ color: categories.find(c => c.slug === activeCategory)?.color }} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {categories.find((c) => c.slug === activeCategory)?.name || 'Posts'}
                  </h2>
                  <p className="text-muted-foreground">
                    {categories.find((c) => c.slug === activeCategory)?.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-muted rounded-2xl mb-4" />
                  <div className="h-4 bg-muted rounded-full w-24 mb-3" />
                  <div className="h-6 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                {activeCategory ? "No posts in this category yet." : "Check back soon for new content."}
              </p>
              {activeCategory && (
                <Button variant="outline" onClick={() => setActiveCategory(null)}>
                  View All Posts
                </Button>
              )}
            </div>
          ) : (
            <>
              <PostGrid
                posts={activeCategory ? posts : posts.filter((p) => p.id !== featuredPost?.id)}
              />

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-16">
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-full"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 px-4">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                          pageNum === pagination.page
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-full"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Weekly Newsletter
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Packaging Insights Delivered
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join 5,000+ procurement professionals. Weekly tips on packaging trends, sourcing strategies, and industry news.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 py-6 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                required
              />
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="px-8 py-6 font-semibold"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            <p className="text-sm text-primary-foreground/60 mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Browse by Topic */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Browse by Topic</h2>
              <p className="text-muted-foreground">
                Explore our content organized by what matters most to you
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const Icon = categoryIcons[category.slug] || BookOpen;
                return (
                  <Link
                    key={category.id}
                    to={`/blog/category/${category.slug}`}
                    className="group relative p-6 bg-card rounded-2xl border hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, ${category.color}10, ${category.color}05)` }}
                    />
                    <div className="relative">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <Icon className="w-7 h-7" style={{ color: category.color }} />
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {category.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                        {category.postCount} articles
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
