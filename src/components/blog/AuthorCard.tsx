import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Globe } from 'lucide-react';
import type { Author } from '@/types/blog';

interface AuthorCardProps {
  author: Author;
  variant?: 'default' | 'compact' | 'full';
}

export function AuthorCard({ author, variant = 'default' }: AuthorCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/blog/author/${author.slug}`}
        className="flex items-center gap-3 group"
      >
        <img
          src={author.avatar}
          alt={author.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-medium group-hover:text-primary transition-colors">
            {author.name}
          </p>
          <p className="text-sm text-muted-foreground">{author.role}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'full') {
    return (
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-start gap-4">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-20 h-20 rounded-full"
          />
          <div className="flex-1">
            <Link
              to={`/blog/author/${author.slug}`}
              className="text-xl font-bold hover:text-primary transition-colors"
            >
              {author.name}
            </Link>
            <p className="text-muted-foreground mb-2">{author.role}</p>
            {author.bio && (
              <p className="text-sm text-muted-foreground mb-4">{author.bio}</p>
            )}
            <div className="flex items-center gap-3">
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
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex items-center gap-4 py-4 border-t border-b">
      <img
        src={author.avatar}
        alt={author.name}
        className="w-14 h-14 rounded-full"
      />
      <div className="flex-1">
        <p className="text-sm text-muted-foreground mb-1">Written by</p>
        <Link
          to={`/blog/author/${author.slug}`}
          className="font-bold hover:text-primary transition-colors"
        >
          {author.name}
        </Link>
        <p className="text-sm text-muted-foreground">{author.role}</p>
      </div>
      <div className="flex items-center gap-2">
        {author.social?.twitter && (
          <a
            href={`https://twitter.com/${author.social.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
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
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label={`${author.name} on LinkedIn`}
          >
            <Linkedin className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default AuthorCard;
