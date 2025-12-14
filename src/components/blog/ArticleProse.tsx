// ============================================================================
// HOLESCALE BLOG - ARTICLE PROSE RENDERER
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Info,
  AlertTriangle,
  Lightbulb,
  FileText,
  ChevronDown,
  Link as LinkIcon,
  Play,
  ZoomIn,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCopyCode } from '@/hooks/useBlog';
import { copyToClipboard } from '@/lib/blog-utils';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ArticleProseProps {
  content: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function ArticleProse({ content, className }: ArticleProseProps) {
  return (
    <div
      className={cn(
        'prose prose-lg max-w-none',
        'prose-headings:font-bold prose-headings:text-neutral-900',
        'prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6',
        'prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4',
        'prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-3',
        'prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:mb-6',
        'prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-neutral-900 prose-strong:font-semibold',
        'prose-ul:my-6 prose-ol:my-6',
        'prose-li:text-neutral-700 prose-li:mb-2',
        'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-neutral-50',
        'prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:rounded-r-xl',
        'prose-blockquote:not-italic prose-blockquote:text-neutral-700',
        'prose-img:rounded-xl prose-img:shadow-md',
        'prose-hr:border-neutral-200 prose-hr:my-12',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

// -----------------------------------------------------------------------------
// Code Block Component
// -----------------------------------------------------------------------------

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
}

export function CodeBlock({
  code,
  language = 'text',
  filename,
  showLineNumbers = true,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const { copyCode, isCopied } = useCopyCode();
  const blockId = `code-${Math.random().toString(36).substr(2, 9)}`;
  const copied = isCopied(blockId);

  const lines = code.split('\n');

  return (
    <div className={cn('relative group rounded-xl overflow-hidden my-8', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700">
        <div className="flex items-center gap-3">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {filename && (
            <span className="text-sm text-neutral-400 font-mono">{filename}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 uppercase">{language}</span>
          <button
            onClick={() => copyCode(code, blockId)}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              copied
                ? 'bg-green-500/20 text-green-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
            )}
            aria-label={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto bg-neutral-900">
        <pre className="p-4 text-sm">
          <code className="font-mono text-neutral-100">
            {lines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  'flex',
                  highlightLines.includes(index + 1) && 'bg-primary/10 -mx-4 px-4'
                )}
              >
                {showLineNumbers && (
                  <span className="select-none w-8 text-right pr-4 text-neutral-600">
                    {index + 1}
                  </span>
                )}
                <span className="flex-1">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Callout Component
// -----------------------------------------------------------------------------

type CalloutType = 'info' | 'warning' | 'tip' | 'note';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutConfig: Record<CalloutType, { icon: React.ElementType; bg: string; border: string; iconColor: string }> = {
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500' },
  tip: { icon: Lightbulb, bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-500' },
  note: { icon: FileText, bg: 'bg-neutral-50', border: 'border-neutral-200', iconColor: 'text-neutral-500' },
};

export function Callout({ type = 'note', title, children, className }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn('rounded-xl border p-5 my-8', config.bg, config.border, className)}>
      <div className="flex gap-4">
        <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-neutral-900 mb-2">{title}</p>
          )}
          <div className="text-neutral-700 text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Expandable Content Component
// -----------------------------------------------------------------------------

interface ExpandableContentProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function ExpandableContent({
  title,
  children,
  defaultOpen = false,
  className,
}: ExpandableContentProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border border-neutral-200 rounded-xl overflow-hidden my-6', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
      >
        <span className="font-medium text-neutral-900">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-neutral-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-t border-neutral-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Image with Lightbox
// -----------------------------------------------------------------------------

interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  creditUrl?: string;
  className?: string;
}

export function ArticleImage({ src, alt, caption, credit, creditUrl, className }: ArticleImageProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <figure className={cn('my-8', className)}>
        <div className="relative group cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full rounded-xl shadow-md"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full">
              <ZoomIn className="w-5 h-5 text-neutral-700" />
            </div>
          </div>
        </div>
        {(caption || credit) && (
          <figcaption className="mt-3 text-center text-sm text-neutral-500">
            {caption}
            {credit && (
              <span className="block mt-1 text-xs">
                Photo by{' '}
                {creditUrl ? (
                  <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {credit}
                  </a>
                ) : (
                  credit
                )}
              </span>
            )}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="absolute top-4 right-4 p-2 text-white/70 hover:text-white">
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// -----------------------------------------------------------------------------
// Video Embed Component
// -----------------------------------------------------------------------------

interface VideoEmbedProps {
  src: string;
  title?: string;
  poster?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1';
  className?: string;
}

export function VideoEmbed({
  src,
  title,
  poster,
  aspectRatio = '16/9',
  className,
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const isVimeo = src.includes('vimeo.com');

  const aspectClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
  };

  if (isYouTube || isVimeo) {
    return (
      <div className={cn('my-8 rounded-xl overflow-hidden shadow-md', aspectClasses[aspectRatio], className)}>
        <iframe
          src={src}
          title={title || 'Video embed'}
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className={cn('my-8 relative rounded-xl overflow-hidden shadow-md group', aspectClasses[aspectRatio], className)}>
      <video
        src={src}
        poster={poster}
        controls={isPlaying}
        onPlay={() => setIsPlaying(true)}
        className="w-full h-full object-cover"
      />
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-neutral-900 ml-1" fill="currentColor" />
          </div>
        </button>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Heading with Anchor
// -----------------------------------------------------------------------------

interface HeadingWithAnchorProps {
  as?: 'h2' | 'h3' | 'h4';
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function HeadingWithAnchor({
  as: Component = 'h2',
  id,
  children,
  className,
}: HeadingWithAnchorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Component id={id} className={cn('group flex items-center gap-2 scroll-mt-24', className)}>
      <span>{children}</span>
      <button
        onClick={handleCopyLink}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-neutral-100"
        aria-label="Copy link to section"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <LinkIcon className="w-4 h-4 text-neutral-400" />
        )}
      </button>
    </Component>
  );
}

// -----------------------------------------------------------------------------
// Reading Progress Bar
// -----------------------------------------------------------------------------

interface ReadingProgressBarProps {
  progress: number;
  variant?: 'top' | 'bottom' | 'floating';
  className?: string;
}

export function ReadingProgressBar({
  progress,
  variant = 'top',
  className,
}: ReadingProgressBarProps) {
  if (variant === 'floating') {
    return (
      <div className={cn('fixed right-4 top-1/2 -translate-y-1/2 z-40', className)}>
        <div className="relative w-1.5 h-32 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-primary rounded-full"
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="mt-2 text-xs text-neutral-500 text-center font-mono">
          {Math.round(progress)}%
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'fixed left-0 right-0 z-50 h-1 bg-neutral-100',
      variant === 'top' ? 'top-0' : 'bottom-0',
      className
    )}>
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-primary/80"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

export default ArticleProse;
