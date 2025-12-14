import type { BlogPostCard } from '@/types/blog';
import { PostCard } from './PostCard';

interface RelatedPostsProps {
  posts: BlogPostCard[];
  title?: string;
}

export function RelatedPosts({ posts, title = 'Related Articles' }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-8">{title}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </section>
  );
}

export default RelatedPosts;
