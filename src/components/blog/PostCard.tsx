import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { BlogPostCard } from '@/types/blog';
import { formatDate } from '@/lib/blog-utils';
import { FadeIn } from '@/components/ui/FadeIn';

interface PostCardProps {
  post: BlogPostCard;
  index?: number;
  variant?: 'default' | 'featured' | 'compact';
}

export function PostCard({ post, index = 0, variant = 'default' }: PostCardProps) {
  if (variant === 'featured') {
    return (
      <FadeIn delay={100}>
        <article className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
          <Link to={`/blog/${post.slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-video md:aspect-auto overflow-hidden">
                <img
                  src={post.featuredImage.src}
                  alt={post.featuredImage.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${post.category.color}20`,
                      color: post.category.color,
                    }}
                  >
                    {post.category.name}
                  </span>
                  {post.isFeatured && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                      Featured
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readingProgress.estimatedReadTime} min read</span>
                  </div>
                </div>
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
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={post.featuredImage.src}
                alt={post.featuredImage.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{formatDate(post.publishedAt)}</span>
                <span>-</span>
                <span>{post.readingProgress.estimatedReadTime} min</span>
              </div>
            </div>
          </Link>
        </article>
      </FadeIn>
    );
  }

  return (
    <FadeIn delay={100 * (index % 3)}>
      <article className="bg-card rounded-2xl shadow-lg border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden h-full flex flex-col">
        <Link to={`/blog/${post.slug}`} className="group">
          <div className="aspect-video overflow-hidden">
            <img
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </Link>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <Link
              to={`/blog/category/${post.category.slug}`}
              className="px-3 py-1 rounded-full font-medium hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: `${post.category.color}20`,
                color: post.category.color,
              }}
            >
              {post.category.name}
            </Link>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </div>
          </div>

          <Link to={`/blog/${post.slug}`}>
            <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
              {post.title}
            </h3>
          </Link>

          <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {post.readingProgress.estimatedReadTime} min read
            </div>
            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              Read More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </FadeIn>
  );
}

export default PostCard;
