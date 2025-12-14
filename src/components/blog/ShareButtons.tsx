import { Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateShareUrls } from '@/lib/blog-utils';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  variant?: 'default' | 'compact';
  size?: 'sm' | 'md' | 'lg';
}

export function ShareButtons({
  url,
  title,
  description,
  variant = 'default',
  size = 'md',
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

  const sizeClasses = {
    sm: 'p-1.5 h-auto min-w-[32px]',
    md: 'p-2 h-auto min-w-[40px]',
    lg: 'p-3 h-auto min-w-[48px]',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const buttonClass = variant === 'compact'
    ? 'p-2 h-auto'
    : sizeClasses[size];

  const iconClass = iconSizes[size];
  const gapClass = size === 'lg' ? 'gap-3' : 'gap-2';

  return (
    <div className={`flex items-center ${gapClass}`}>
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
          <Twitter className={iconClass} />
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
          <Linkedin className={iconClass} />
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
          <Facebook className={iconClass} />
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
          <Check className={`${iconClass} text-green-600`} />
        ) : (
          <Link2 className={iconClass} />
        )}
      </Button>
    </div>
  );
}

export default ShareButtons;
