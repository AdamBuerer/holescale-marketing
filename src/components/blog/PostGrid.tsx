import type { BlogPostCard } from '@/types/blog';
import { PostCard } from './PostCard';

interface PostGridProps {
  posts: BlogPostCard[];
  columns?: 2 | 3;
  showFeatured?: boolean;
}

export function PostGrid({ posts, columns = 3, showFeatured = false }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  // Separate featured post if requested
  const featuredPost = showFeatured ? posts.find((p) => p.isFeatured) : null;
  const regularPosts = showFeatured && featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  return (
    <div className="space-y-8">
      {featuredPost && (
        <div className="mb-12">
          <PostCard post={featuredPost} variant="featured" />
        </div>
      )}
      <div
        className={`grid gap-8 ${
          columns === 2
            ? 'md:grid-cols-2'
            : 'md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {regularPosts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}

export default PostGrid;
