import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FadeIn';
import { useBlogCategory, useCategoryPosts } from '@/hooks/useBlogData';
import { PostGrid } from '@/components/blog/PostGrid';
import { generateCollectionSchema, generateBreadcrumbSchema, getCategoryMetaTags } from '@/lib/blog-seo';

export default function BlogCategory() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: categoryLoading } = useBlogCategory(slug || '');
  const { data: postsData, isLoading: postsLoading } = useCategoryPosts(slug || '');

  const isLoading = categoryLoading || postsLoading;

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2 mb-8" />
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!category) {
    return (
      <>
        <SEO
          title="Category Not Found | HoleScale Blog"
          description="The category you're looking for could not be found."
        />
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The category you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const metaTags = getCategoryMetaTags(category);
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.holescale.com' },
    { name: 'Blog', url: 'https://www.holescale.com/blog' },
    { name: category.name, url: `https://www.holescale.com/blog/category/${category.slug}` },
  ];
  const schemas = [
    generateCollectionSchema('category', category, category.postCount),
    generateBreadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <SEO
        title={metaTags.title}
        description={metaTags.description}
        canonical={metaTags.canonical}
        schema={schemas}
      />

      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-muted/30 py-3 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div
              className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
              }}
            >
              Category
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-muted-foreground max-w-2xl">
                {category.description}
              </p>
            )}
            <p className="text-muted-foreground mt-4">
              {category.postCount} {category.postCount === 1 ? 'article' : 'articles'}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PostGrid posts={postsData?.data || []} />
        </div>
      </section>

      <Footer />
    </>
  );
}
