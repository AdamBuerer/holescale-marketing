import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { BlogPostCard } from '@/types/blog';
import { formatDate } from '@/lib/blog-utils';
import { FadeIn } from '@/components/ui/FadeIn';

interface PostCardProps {
  post: BlogPostCard;
  index?: number;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
}

export function PostCard({ post, index = 0, variant = 'default' }: PostCardProps) {
  if (variant === 'featured') {
    return (
      <FadeIn delay={100}>
        <article className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-500">
          <Link to={`/blog/${post.slug}`} className="block">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img
                  src={post.featuredImage.src}
                  alt={post.featuredImage.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: post.category.color,
                      color: 'white',
                    }}
                  >
                    {post.category.name}
                  </span>
                  {post.isFeatured && (
                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Featured
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors duration-300 text-left">
                  {post.title}
                </h2>

                <p className="text-muted-foreground text-lg mb-6 line-clamp-3 leading-relaxed text-left">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full ring-2 ring-background"
                    />
                    <div>
                      <span className="font-medium text-foreground block">{post.author.name}</span>
                      <span className="text-xs">{post.author.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{post.readingProgress.estimatedReadTime} min</span>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  Read Article
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        </article>
      </FadeIn>
    );
  }

  if (variant === 'horizontal') {
    return (
      <FadeIn delay={100 * (index % 3)}>
        <article className="group">
          <Link to={`/blog/${post.slug}`} className="flex gap-6 items-start">
            <div className="w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden">
              <img
                src={post.featuredImage.src}
                alt={post.featuredImage.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-2"
                style={{
                  backgroundColor: `${post.category.color}15`,
                  color: post.category.color,
                }}
              >
                {post.category.name}
              </span>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {post.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(post.publishedAt)}</span>
                <span>•</span>
                <span>{post.readingProgress.estimatedReadTime} min read</span>
              </div>
            </div>
          </Link>
        </article>
      </FadeIn>
    );
  }

  if (variant === 'compact') {
    return (
      <FadeIn delay={100 * (index % 3)}>
        <article className="group">
          <Link to={`/blog/${post.slug}`} className="flex gap-4">
            <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
              <img
                src={post.featuredImage.src}
                alt={post.featuredImage.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0 py-1">
              <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(post.publishedAt)}</span>
                <span>•</span>
                <span>{post.readingProgress.estimatedReadTime} min</span>
              </div>
            </div>
          </Link>
        </article>
      </FadeIn>
    );
  }

  // Default card
  return (
    <FadeIn delay={100 * (index % 3)}>
      <article className="group h-full">
        <Link to={`/blog/${post.slug}`} className="block h-full">
          <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 h-full flex flex-col">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={post.featuredImage.src}
                alt={post.featuredImage.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
                  style={{
                    backgroundColor: `${post.category.color}ee`,
                    color: 'white',
                  }}
                >
                  {post.category.name}
                </span>
              </div>

              {/* Read time badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-foreground flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {post.readingProgress.estimatedReadTime} min
                </span>
              </div>

              {/* Hover arrow */}
              <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug text-left">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-2 leading-relaxed text-left">
                {post.excerpt}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{post.author.name}</span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    </FadeIn>
  );
}

export default PostCard;
