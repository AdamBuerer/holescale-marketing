import { Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateShareUrls } from '@/lib/blog-utils';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  variant?: 'default' | 'compact';
}

export function ShareButtons({
  url,
  title,
  description,
  variant = 'default',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrls = generateShareUrls(url, title, description);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const buttonClass = variant === 'compact'
    ? 'p-2 h-auto'
    : 'p-2 h-auto min-w-[40px]';

  return (
    <div className="flex items-center gap-2">
      {variant === 'default' && (
        <span className="text-sm text-muted-foreground mr-2">Share:</span>
      )}
      <Button
        variant="ghost"
        size="sm"
        className={buttonClass}
        asChild
      >
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={buttonClass}
        asChild
      >
        <a
          href={shareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={buttonClass}
        asChild
      >
        <a
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={buttonClass}
        onClick={handleCopyLink}
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}

export default ShareButtons;
