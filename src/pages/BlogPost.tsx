import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FadeIn';
import { useBlogPost, useRelatedPosts } from '@/hooks/useBlogData';
import { formatDate } from '@/lib/blog-utils';
import { generateBlogPostSchemas, getBlogPostMetaTags } from '@/lib/blog-seo';
import { AuthorCard } from '@/components/blog/AuthorCard';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { BlogCTA } from '@/components/blog/BlogCTA';

function BlogPostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-muted rounded w-3/4 mb-4" />
      <div className="h-4 bg-muted rounded w-1/2 mb-8" />
      <div className="aspect-video bg-muted rounded-xl mb-8" />
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || '');
  const { data: relatedPosts } = useRelatedPosts(
    post?.id || '',
    post?.category.id || '',
    3
  );

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BlogPostSkeleton />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <SEO
          title="Article Not Found | HoleScale Blog"
          description="The article you're looking for could not be found."
        />
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
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

  const metaTags = getBlogPostMetaTags(post);
  const schemas = generateBlogPostSchemas(post);
  const postUrl = `https://www.holescale.com/blog/${post.slug}`;

  // Determine CTA variant based on category
  const ctaVariant = post.category.slug === 'supplier-success' ? 'supplier' : 'buyer';

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/blog/category/${post.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {post.category.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Link
                  to={`/blog/category/${post.category.slug}`}
                  className="px-3 py-1 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: `${post.category.color}20`,
                    color: post.category.color,
                  }}
                >
                  {post.category.name}
                </Link>
                {post.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/blog/tag/${tag.slug}`}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>

              {post.subtitle && (
                <p className="text-xl text-muted-foreground mb-6">
                  {post.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <Link
                  to={`/blog/author/${post.author.slug}`}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{post.author.name}</span>
                </Link>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingProgress.estimatedReadTime} min read</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <ShareButtons
                  url={postUrl}
                  title={post.title}
                  description={post.excerpt}
                />
              </div>
            </header>
          </FadeIn>

          {/* Featured Image */}
          <FadeIn delay={100}>
            <div className="aspect-video rounded-xl overflow-hidden mb-10">
              <img
                src={post.featuredImage.src}
                alt={post.featuredImage.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>

          {/* Article Content */}
          <FadeIn delay={200}>
            <div
              className="prose prose-lg max-w-none mb-10
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-ul:my-4 prose-ol:my-4
                prose-li:text-muted-foreground
                prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
                prose-table:border prose-th:bg-muted prose-th:p-3 prose-td:p-3 prose-td:border"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </FadeIn>

          {/* Tags */}
          {post.tags.length > 0 && (
            <FadeIn delay={300}>
              <div className="flex flex-wrap items-center gap-2 mb-8 pb-8 border-b">
                <span className="text-sm text-muted-foreground">Tags:</span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/blog/tag/${tag.slug}`}
                    className="px-3 py-1 rounded-full text-sm bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </FadeIn>
          )}

          {/* CTA */}
          <FadeIn delay={400}>
            <BlogCTA variant={ctaVariant} postSlug={post.slug} className="mb-10" />
          </FadeIn>

          {/* Author Card */}
          <FadeIn delay={500}>
            <AuthorCard author={post.author} />
          </FadeIn>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RelatedPosts posts={relatedPosts} />
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Get More Packaging Insights
          </h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for weekly tips on packaging, procurement, and B2B sourcing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
