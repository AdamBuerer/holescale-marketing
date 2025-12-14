import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Calendar, Clock, ChevronRight, ArrowLeft, ArrowUp, Bookmark, Share2 } from 'lucide-react';
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
import { AISummary } from '@/components/blog/AISummary';

function BlogPostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-muted rounded w-3/4 mb-4" />
      <div className="h-5 bg-muted rounded w-1/2 mb-8" />
      <div className="aspect-[21/9] bg-muted rounded-2xl mb-12" />
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
}

interface ReadingProgressProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

function ReadingProgress({ targetRef }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (!targetRef.current) {
        // Fallback to document-based calculation
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const readProgress = (scrollTop / docHeight) * 100;
        setProgress(Math.min(100, Math.max(0, readProgress)));
        return;
      }

      const scrollTop = window.scrollY;
      const targetTop = targetRef.current.offsetTop;
      // Complete at 100% when the target element is in view (accounting for viewport height)
      const targetEnd = targetTop - window.innerHeight * 0.3;
      const startOffset = 200; // Start measuring after scrolling past header

      if (scrollTop < startOffset) {
        setProgress(0);
        return;
      }

      const adjustedScroll = scrollTop - startOffset;
      const totalDistance = targetEnd - startOffset;
      const readProgress = (adjustedScroll / totalDistance) * 100;
      setProgress(Math.min(100, Math.max(0, readProgress)));
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial calculation
    return () => window.removeEventListener('scroll', updateProgress);
  }, [targetRef]);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-[60]">
      <div
        className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
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
  const articleRef = useRef<HTMLDivElement>(null);
  const authorSectionRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild size="lg">
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

      <ReadingProgress targetRef={authorSectionRef} />
      <ScrollToTop />
      <Navigation />

      {/* Hero Header */}
      <header className="bg-gradient-to-b from-muted/50 to-background pt-8 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <FadeIn>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
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
                style={{ color: post.category.color }}
              >
                {post.category.name}
              </Link>
            </nav>
          </FadeIn>

          {/* Article Header */}
          <FadeIn delay={100}>
            <div className="max-w-4xl">
              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Link
                  to={`/blog/category/${post.category.slug}`}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: post.category.color,
                    color: 'white',
                  }}
                >
                  {post.category.name}
                </Link>
                {post.tags.slice(0, 2).map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/blog/tag/${tag.slug}`}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-[1.15] tracking-tight">
                {post.title}
              </h1>

              {/* Subtitle */}
              {post.subtitle && (
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                  {post.subtitle}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                {/* Author */}
                <Link
                  to={`/blog/author/${post.author.slug}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-background"
                  />
                  <div className="leading-tight">
                    <p className="font-semibold text-foreground">{post.author.name}</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">{post.author.role}</p>
                  </div>
                </Link>

                <div className="h-6 sm:h-8 w-px bg-border hidden sm:block" />

                {/* Date */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                {/* Reading Time */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingProgress.estimatedReadTime} min read</span>
                </div>

                <div className="flex-1" />

                {/* Share */}
                <div className="hidden sm:block">
                  <ShareButtons
                    url={postUrl}
                    title={post.title}
                    description={post.excerpt}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* Featured Image */}
      <FadeIn delay={200}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </FadeIn>

      {/* Article Content */}
      <article ref={articleRef} className="py-12 md:py-16" style={{ overflow: 'visible' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" style={{ overflow: 'visible' }}>
          {/* AI Summary Button */}
          <FadeIn delay={250}>
            <AISummary
              content={post.content}
              title={post.title}
              readingTime={post.readingProgress.estimatedReadTime}
              postId={post.id}
            />
          </FadeIn>

          <FadeIn delay={300}>
            {/* Article Body */}
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </FadeIn>

          {/* Article Styles */}
          <style>{`
            .article-content {
              font-size: 1.125rem;
              line-height: 1.8;
              color: hsl(var(--muted-foreground));
              overflow: visible !important;
            }

            .article-content * {
              overflow: visible !important;
            }

            .article-content pre {
              overflow-x: auto !important;
            }

            .article-content h2 {
              font-size: 1.875rem;
              font-weight: 700;
              color: hsl(var(--foreground));
              margin-top: 3rem;
              margin-bottom: 1.5rem;
              line-height: 1.3;
              letter-spacing: -0.02em;
              scroll-margin-top: 5rem;
              padding-bottom: 0.75rem;
              border-bottom: 2px solid hsl(var(--border));
            }

            .article-content h3 {
              font-size: 1.5rem;
              font-weight: 600;
              color: hsl(var(--foreground));
              margin-top: 2.5rem;
              margin-bottom: 1rem;
              line-height: 1.4;
              scroll-margin-top: 5rem;
            }

            .article-content h4 {
              font-size: 1.25rem;
              font-weight: 600;
              color: hsl(var(--foreground));
              margin-top: 2rem;
              margin-bottom: 0.75rem;
            }

            .article-content p {
              margin-bottom: 1.5rem;
              line-height: 1.8;
            }

            .article-content p:first-of-type {
              font-size: 1.25rem;
              color: hsl(var(--foreground));
              line-height: 1.7;
            }

            .article-content a {
              color: hsl(var(--primary));
              font-weight: 500;
              text-decoration: none;
              border-bottom: 1px solid transparent;
              transition: border-color 0.2s;
            }

            .article-content a:hover {
              border-bottom-color: hsl(var(--primary));
            }

            .article-content strong {
              color: hsl(var(--foreground));
              font-weight: 600;
            }

            .article-content ul,
            .article-content ol {
              margin: 1.5rem 0;
              padding-left: 1.5rem;
            }

            .article-content ul {
              list-style-type: disc;
            }

            .article-content ol {
              list-style-type: decimal;
            }

            .article-content li {
              margin-bottom: 0.75rem;
              line-height: 1.7;
              padding-left: 0.5rem;
            }

            .article-content li::marker {
              color: hsl(var(--primary));
            }

            .article-content blockquote {
              margin: 2rem 0;
              padding: 1.5rem 2rem;
              border-left: 4px solid hsl(var(--primary));
              background: hsl(var(--muted) / 0.5);
              border-radius: 0 1rem 1rem 0;
              font-style: normal;
              color: hsl(var(--foreground));
              font-weight: 500;
            }

            .article-content blockquote p {
              margin-bottom: 0;
              font-size: 1.125rem;
            }

            .article-content code {
              background: hsl(var(--muted));
              padding: 0.2rem 0.5rem;
              border-radius: 0.375rem;
              font-size: 0.875rem;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            }

            .article-content pre {
              background: #1e293b;
              color: #e2e8f0;
              padding: 1.5rem;
              border-radius: 1rem;
              overflow-x: auto;
              margin: 2rem 0;
              box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            }

            .article-content pre code {
              background: transparent;
              padding: 0;
              font-size: 0.875rem;
            }

            .article-content img {
              border-radius: 1rem;
              box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
              margin: 2rem 0;
            }

            .article-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 2rem 0;
              border-radius: 1rem;
              overflow: hidden;
              border: 1px solid hsl(var(--border));
            }

            .article-content th {
              background: hsl(var(--muted));
              padding: 1rem;
              text-align: left;
              font-weight: 600;
              color: hsl(var(--foreground));
            }

            .article-content td {
              padding: 1rem;
              border-top: 1px solid hsl(var(--border));
            }

            .article-content hr {
              margin: 3rem 0;
              border: none;
              border-top: 1px solid hsl(var(--border));
            }

            @media (min-width: 768px) {
              .article-content {
                font-size: 1.1875rem;
              }

              .article-content h2 {
                font-size: 2.25rem;
              }

              .article-content h3 {
                font-size: 1.75rem;
              }

              .article-content p:first-of-type {
                font-size: 1.375rem;
              }
            }
          `}</style>

          {/* Mobile Share */}
          <div className="sm:hidden my-8 flex justify-center">
            <ShareButtons
              url={postUrl}
              title={post.title}
              description={post.excerpt}
            />
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <FadeIn delay={400}>
              <div className="flex flex-wrap items-center gap-2 my-10 py-8 border-t border-b">
                <span className="text-sm font-medium text-muted-foreground mr-2">Tagged:</span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/blog/tag/${tag.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </FadeIn>
          )}

          {/* CTA */}
          <FadeIn delay={500}>
            <BlogCTA variant={ctaVariant} postSlug={post.slug} className="my-12" />
          </FadeIn>

          {/* Author Card */}
          <FadeIn delay={600}>
            <div ref={authorSectionRef} className="bg-muted/50 rounded-2xl p-6 md:p-8">
              <p className="text-sm font-medium text-muted-foreground mb-4">Written by</p>
              <div className="flex items-start gap-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <Link
                    to={`/blog/author/${post.author.slug}`}
                    className="text-xl font-bold hover:text-primary transition-colors"
                  >
                    {post.author.name}
                  </Link>
                  <p className="text-muted-foreground mb-3">{post.author.role}</p>
                  {post.author.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Share Section */}
          <FadeIn delay={700}>
            <div className="mt-10 pt-8 border-t border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground mb-1">Enjoyed this article?</p>
                  <p className="text-sm text-muted-foreground">Share it with your network</p>
                </div>
                <ShareButtons
                  url={postUrl}
                  title={post.title}
                  description={post.excerpt}
                  size="lg"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Continue Reading</h2>
                <p className="text-muted-foreground">
                  More articles you might enjoy
                </p>
              </div>
              <RelatedPosts posts={relatedPosts} />
            </FadeIn>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enjoyed this article?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter for weekly packaging insights, procurement tips, and industry news.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 focus:outline-none"
              />
              <Button variant="secondary" size="lg" className="font-semibold">
                Subscribe
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
