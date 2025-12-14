import type { BlogPostCard } from '@/types/blog';
import { PostCard } from './PostCard';

interface RelatedPostsProps {
  posts: BlogPostCard[];
  title?: string;
}

export function RelatedPosts({ posts, title = 'Related Articles' }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.slice(0, 3).map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}

export default RelatedPosts;
