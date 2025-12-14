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

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const readProgress = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, readProgress)));
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
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

      <ReadingProgress />
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
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {/* Author */}
                <Link
                  to={`/blog/author/${post.author.slug}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full ring-2 ring-background"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{post.author.name}</p>
                    <p className="text-muted-foreground">{post.author.role}</p>
                  </div>
                </Link>

                <div className="h-8 w-px bg-border hidden sm:block" />

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
      <article ref={articleRef} className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={300}>
            {/* Article Body */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:scroll-mt-20
                prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:scroll-mt-20
                prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3
                prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:mb-6
                prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-6 prose-ol:my-6 prose-ul:pl-6 prose-ol:pl-6
                prose-li:text-muted-foreground prose-li:leading-[1.8] prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-foreground prose-blockquote:font-medium
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:shadow-lg
                prose-img:rounded-xl prose-img:shadow-lg
                prose-table:border prose-table:rounded-xl prose-table:overflow-hidden
                prose-th:bg-muted prose-th:p-4 prose-th:text-left prose-th:font-semibold
                prose-td:p-4 prose-td:border-t
                prose-hr:my-12 prose-hr:border-border"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </FadeIn>

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
            <div className="bg-muted/50 rounded-2xl p-6 md:p-8">
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
