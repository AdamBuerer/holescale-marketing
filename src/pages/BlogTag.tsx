import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Tag as TagIcon } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FadeIn';
import { useBlogTag, useTagPosts } from '@/hooks/useBlogData';
import { PostGrid } from '@/components/blog/PostGrid';
import { generateCollectionSchema, generateBreadcrumbSchema } from '@/lib/blog-seo';

export default function BlogTag() {
  const { slug } = useParams<{ slug: string }>();
  const { data: tag, isLoading: tagLoading } = useBlogTag(slug || '');
  const { data: postsData, isLoading: postsLoading } = useTagPosts(slug || '');

  const isLoading = tagLoading || postsLoading;

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

  if (!tag) {
    return (
      <>
        <SEO
          title="Tag Not Found | HoleScale Blog"
          description="The tag you're looking for could not be found."
        />
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Tag Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The tag you're looking for doesn't exist.
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

  const breadcrumbs = [
    { name: 'Home', url: 'https://www.holescale.com' },
    { name: 'Blog', url: 'https://www.holescale.com/blog' },
    { name: tag.name, url: `https://www.holescale.com/blog/tag/${tag.slug}` },
  ];
  const schemas = [
    generateCollectionSchema('tag', tag, tag.postCount),
    generateBreadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <SEO
        title={`${tag.name} Articles | HoleScale Blog`}
        description={`Browse ${tag.postCount} articles tagged with ${tag.name} on the HoleScale Blog.`}
        canonical={`https://www.holescale.com/blog/tag/${tag.slug}`}
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
            <span className="text-foreground">{tag.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center gap-2 mb-4">
              <TagIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tag</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{tag.name}</h1>
            <p className="text-muted-foreground">
              {tag.postCount} {tag.postCount === 1 ? 'article' : 'articles'}
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
