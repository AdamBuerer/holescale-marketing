import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Linkedin, Twitter, Globe } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/FadeIn';
import { useBlogAuthor, useAuthorPosts } from '@/hooks/useBlogData';
import { PostGrid } from '@/components/blog/PostGrid';
import { generateAuthorSchema, generateBreadcrumbSchema, getAuthorMetaTags } from '@/lib/blog-seo';

export default function BlogAuthor() {
  const { slug } = useParams<{ slug: string }>();
  const { data: author, isLoading: authorLoading } = useBlogAuthor(slug || '');
  const { data: postsData, isLoading: postsLoading } = useAuthorPosts(slug || '');

  const isLoading = authorLoading || postsLoading;

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-muted rounded-full" />
              <div>
                <div className="h-8 bg-muted rounded w-48 mb-2" />
                <div className="h-4 bg-muted rounded w-32" />
              </div>
            </div>
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

  if (!author) {
    return (
      <>
        <SEO
          title="Author Not Found | HoleScale Blog"
          description="The author you're looking for could not be found."
        />
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Author Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The author you're looking for doesn't exist.
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

  const metaTags = getAuthorMetaTags(author);
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.holescale.com' },
    { name: 'Blog', url: 'https://www.holescale.com/blog' },
    { name: author.name, url: `https://www.holescale.com/blog/author/${author.slug}` },
  ];
  const schemas = [
    generateAuthorSchema(author),
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
            <span className="text-foreground">{author.name}</span>
          </nav>
        </div>
      </div>

      {/* Author Header */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
              />
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{author.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {author.role}
                  {author.company && ` at ${author.company}`}
                </p>
                {author.bio && (
                  <p className="text-muted-foreground mb-4 max-w-2xl">
                    {author.bio}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  {author.social?.twitter && (
                    <a
                      href={`https://twitter.com/${author.social.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`${author.name} on Twitter`}
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {author.social?.linkedin && (
                    <a
                      href={author.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`${author.name} on LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {author.social?.website && (
                    <a
                      href={author.social.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`${author.name}'s website`}
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Author's Posts */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Articles by {author.name}
            <span className="text-muted-foreground font-normal ml-2">
              ({author.articlesCount})
            </span>
          </h2>
          <PostGrid posts={postsData?.data || []} />
        </div>
      </section>

      <Footer />
    </>
  );
}
