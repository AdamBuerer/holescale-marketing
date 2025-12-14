// ============================================================================
// HOLESCALE BLOG - NEWSLETTER SUBSCRIPTION COMPONENT
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Sparkles,
  Check,
  ArrowRight,
  Loader2,
  Bell,
  Gift,
  BookOpen,
  TrendingUp,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNewsletter } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type NewsletterVariant = 'inline' | 'card' | 'banner' | 'modal' | 'sidebar' | 'minimal';

interface NewsletterProps {
  variant?: NewsletterVariant;
  title?: string;
  description?: string;
  benefits?: string[];
  showBenefits?: boolean;
  className?: string;
  source?: string;
  onSuccess?: () => void;
  onDismiss?: () => void;
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function NewsletterSubscription({
  variant = 'card',
  title = 'Stay in the Loop',
  description = 'Get the latest insights on packaging, industry trends, and marketplace tips delivered to your inbox.',
  benefits = [
    'Weekly industry insights',
    'Exclusive supplier tips',
    'Early access to features',
    'No spam, unsubscribe anytime',
  ],
  showBenefits = true,
  className,
  source = 'blog',
  onSuccess,
  onDismiss,
}: NewsletterProps) {
  const {
    email,
    setEmail,
    subscribe,
    isSubmitting,
    isSuccess,
    error,
    reset,
  } = useNewsletter({ source, onSuccess });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await subscribe();
  };

  const commonProps = {
    email,
    setEmail,
    onSubmit: handleSubmit,
    isSubmitting,
    isSuccess,
    error,
    title,
    description,
    benefits,
    showBenefits,
    onDismiss,
    reset,
    className,
  };

  switch (variant) {
    case 'inline':
      return <InlineNewsletter {...commonProps} />;
    case 'banner':
      return <BannerNewsletter {...commonProps} />;
    case 'sidebar':
      return <SidebarNewsletter {...commonProps} />;
    case 'minimal':
      return <MinimalNewsletter {...commonProps} />;
    case 'modal':
      return <ModalNewsletter {...commonProps} />;
    default:
      return <CardNewsletter {...commonProps} />;
  }
}

// -----------------------------------------------------------------------------
// Card Variant (Default)
// -----------------------------------------------------------------------------

function CardNewsletter({
  title,
  description,
  benefits,
  showBenefits,
  email,
  setEmail,
  onSubmit,
  isSubmitting,
  isSuccess,
  error,
  className,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800',
        'p-8 lg:p-10',
        className
      )}
    >
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect fill="url(#grid)" width="100%" height="100%" />
        </svg>
      </div>

      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

      <div className="relative">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <SuccessState key="success" />
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }}>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-6">
                <Mail className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                {title}
              </h3>
              <p className="text-white/70 text-lg mb-6 max-w-lg">{description}</p>

              {showBenefits && benefits && benefits.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-white/80">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={cn(
                    'h-12 flex-1 bg-white/10 border-white/20',
                    'text-white placeholder:text-white/50',
                    'focus:bg-white/15 focus:border-white/40'
                  )}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-6 bg-white text-neutral-900 font-semibold hover:bg-white/90"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-red-300"
                >
                  {error}
                </motion.p>
              )}

              <p className="mt-4 text-xs text-white/50">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Inline Variant
// -----------------------------------------------------------------------------

function InlineNewsletter({ email, setEmail, onSubmit, isSubmitting, isSuccess, error, className }: any) {
  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-600"
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">You're subscribed!</span>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="h-10 flex-1 min-w-0"
            />
            <Button type="submit" disabled={isSubmitting} size="sm" className="h-10 px-4">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Banner Variant
// -----------------------------------------------------------------------------

function BannerNewsletter({
  title,
  description,
  email,
  setEmail,
  onSubmit,
  isSubmitting,
  isSuccess,
  error,
  onDismiss,
  className,
}: any) {
  return (
    <div className={cn('relative bg-gradient-to-r from-primary to-primary/80 py-4 px-4 lg:px-8', className)}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-white">
          <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-white/80 hidden sm:block">{description}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-white">
              <Check className="w-5 h-5" />
              <span className="font-medium">Thanks for subscribing!</span>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={onSubmit} className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-10 w-full md:w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button type="submit" disabled={isSubmitting} className="h-10 px-5 bg-white text-primary hover:bg-white/90">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {onDismiss && (
          <button onClick={onDismiss} className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-white/60 hover:text-white md:relative md:top-auto md:right-auto md:translate-y-0">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-center text-sm text-red-200">{error}</p>}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sidebar Variant
// -----------------------------------------------------------------------------

function SidebarNewsletter({ title, description, benefits, showBenefits, email, setEmail, onSubmit, isSubmitting, isSuccess, error, className }: any) {
  return (
    <div className={cn('rounded-xl border border-neutral-200 bg-white p-5', className)}>
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <SuccessState variant="compact" />
        ) : (
          <motion.div key="form">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900">{title}</h4>
                <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
              </div>
            </div>

            {showBenefits && benefits && (
              <ul className="space-y-2 mb-4">
                {benefits.slice(0, 3).map((benefit: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-neutral-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="h-10" />
              <Button type="submit" disabled={isSubmitting} className="w-full h-10">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Subscribe Free <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </form>
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Minimal Variant
// -----------------------------------------------------------------------------

function MinimalNewsletter({ email, setEmail, onSubmit, isSubmitting, isSuccess, error, className }: any) {
  return (
    <div className={cn('text-center', className)}>
      <p className="text-sm text-neutral-600 mb-3">Get weekly insights delivered to your inbox</p>
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 text-green-600 text-sm">
            <Check className="w-4 h-4" />
            <span>Subscribed!</span>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} className="flex justify-center gap-2">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="h-9 w-48 text-sm" />
            <Button type="submit" size="sm" disabled={isSubmitting} className="h-9">
              {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Go'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Modal Variant
// -----------------------------------------------------------------------------

function ModalNewsletter({ title, description, benefits, email, setEmail, onSubmit, isSubmitting, isSuccess, error, reset, onDismiss, className }: any) {
  if (!onDismiss) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={cn('relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden', className)}
      >
        <button onClick={onDismiss} className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 z-10">
          <X className="w-5 h-5 text-neutral-500" />
        </button>

        <div className="h-32 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Gift className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <SuccessState variant="compact" onReset={reset} />
            ) : (
              <motion.div key="form">
                <h3 className="text-xl font-bold text-neutral-900 text-center mb-2">{title}</h3>
                <p className="text-neutral-600 text-center mb-6">{description}</p>

                {benefits && (
                  <ul className="space-y-2 mb-6">
                    {benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-neutral-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}

                <form onSubmit={onSubmit} className="space-y-3">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="h-12" />
                  <Button type="submit" disabled={isSubmitting} className="w-full h-12">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get Free Access <ArrowRight className="w-4 h-4 ml-2" /></>}
                  </Button>
                </form>

                {error && <p className="mt-3 text-sm text-red-500 text-center">{error}</p>}
                <p className="mt-4 text-xs text-neutral-400 text-center">No spam. Unsubscribe anytime.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Success State
// -----------------------------------------------------------------------------

function SuccessState({ variant = 'default', onReset }: { variant?: 'default' | 'compact'; onReset?: () => void }) {
  if (variant === 'compact') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <h4 className="font-semibold text-neutral-900 mb-1">You're in!</h4>
        <p className="text-sm text-neutral-500">Check your inbox to confirm.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-500" />
      </motion.div>
      <h3 className="text-2xl font-bold text-white mb-2">Welcome Aboard!</h3>
      <p className="text-white/70 mb-6">Check your inbox to confirm your subscription.</p>
      <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
        <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /><span>Weekly insights</span></div>
        <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /><span>Industry trends</span></div>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Exit Intent Hook
// -----------------------------------------------------------------------------

export function useExitIntentNewsletter(delay: number = 3000) {
  const [showModal, setShowModal] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  React.useEffect(() => {
    const shown = sessionStorage.getItem('newsletter_exit_shown');
    if (shown) { setHasShown(true); return; }

    const timer = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !hasShown) {
          setShowModal(true);
          setHasShown(true);
          sessionStorage.setItem('newsletter_exit_shown', 'true');
          document.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, hasShown]);

  return { showModal, closeModal: () => setShowModal(false) };
}

export default NewsletterSubscription;
