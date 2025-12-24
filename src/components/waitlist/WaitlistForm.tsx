import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, User, Building2, Loader2, CheckCircle2, Package, TrendingUp, Sparkles, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { waitlistFormSchema, type WaitlistFormData } from '@/lib/validations/waitlist';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useFormTracking } from '@/hooks/useAnalytics';
import { trackWaitlistSignup } from '@/lib/analytics';

interface WaitlistFormProps {
  onSuccess?: () => void;
  showCompanySize?: boolean;
  showInterest?: boolean;
  showReferralSource?: boolean;
  defaultRole?: 'buyer' | 'supplier' | 'both';
  compact?: boolean;
}

export function WaitlistForm({
  onSuccess,
  showCompanySize = true,
  showInterest = true,
  showReferralSource = true,
  defaultRole = 'buyer',
  compact = false,
}: WaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { trackStart, trackSubmit } = useFormTracking('waitlist', window.location.pathname);

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: '',
      name: '',
      company: '',
      role: defaultRole,
      productCategory: '',
      orderVolume: '',
      supplierCategories: '',
      annualRevenue: '',
      companySize: '',
      primaryInterest: '',
      referralSource: '',
    },
  });

  const selectedRole = form.watch('role');

  // Track form start when user begins interacting
  useEffect(() => {
    const subscription = form.watch(() => {
      trackStart();
    });
    return () => subscription.unsubscribe();
  }, [form, trackStart]);

  const onSubmit = async (data: WaitlistFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = {
        utm_source: urlParams.get('utm_source') || null,
        utm_medium: urlParams.get('utm_medium') || null,
        utm_campaign: urlParams.get('utm_campaign') || null,
        utm_term: urlParams.get('utm_term') || null,
        utm_content: urlParams.get('utm_content') || null,
      };

      const referrer = document.referrer || null;

      if (!supabase) {
        throw new Error('Waitlist service is not configured. Please try again later.');
      }

      const { data: result, error } = await supabase.functions.invoke('submit-waitlist', {
        body: {
          email: data.email,
          name: data.name || null,
          company: data.company || null,
          role: data.role,
          productCategory: data.productCategory || null,
          orderVolume: data.orderVolume || null,
          supplierCategories: data.supplierCategories || null,
          annualRevenue: data.annualRevenue || null,
          companySize: data.companySize || null,
          primaryInterest: data.primaryInterest || null,
          referralSource: data.referralSource || null,
          referral_source: referrer,
          ...utmParams,
        },
      });

      if (error) {
        logger.error('Waitlist submission error', { error });

        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          toast({
            title: "Already on the waitlist",
            description: "This email is already registered. We'll be in touch soon!",
            variant: "default",
          });
          return;
        }

        throw error;
      }

      if (result?.success) {
        setSubmitted(true);
        form.reset();

        // Track successful signup
        trackSubmit(true);
        trackWaitlistSignup(
          data.role as 'buyer' | 'supplier' | 'other',
          data.referralSource || undefined,
          data.companySize || undefined
        );

        toast({
          title: "You're on the list!",
          description: "We'll be in touch soon with next steps.",
        });

        onSuccess?.();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error: unknown) {
      logger.error('Waitlist submission error', { error });
      trackSubmit(false, error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://www.holescale.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link copied!",
        description: "Share it with your network.",
      });
    } catch (err) {
      // Fallback for older browsers
    }
  };

  if (submitted) {
    const shareUrl = `https://www.holescale.com`;
    const shareText = `I just joined the HoleScale waitlist - a B2B marketplace for packaging materials! Check it out:`;

    return (
      <div className="space-y-6">
        {/* Success Animation */}
        <div className="text-center py-6">
          <div className="relative inline-flex">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>

          <h3 className="mt-4 text-xl font-bold text-foreground">
            You're In! 🎉
          </h3>
          <p className="mt-2 text-muted-foreground">
            Check your email for confirmation details.
          </p>
        </div>

        {/* Share Section */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-center text-foreground">
            Share with your network
          </p>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter/X
            </a>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-4', compact && 'space-y-3')}>
        {/* Email & Name in a row on desktop when compact */}
        <div className={cn(compact && 'grid md:grid-cols-2 gap-3')}>
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn('text-sm', compact && 'sr-only')}>
                  Email Address <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      className="pr-3"
                      style={{ paddingLeft: '0.75rem' }}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn('text-sm', compact && 'sr-only')}>
                  Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      className="pr-3"
                      style={{ paddingLeft: '0.75rem' }}
                      {...field}
                      value={field.value || ''}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Company & Size in a row */}
        <div className={cn(compact && showCompanySize && 'grid md:grid-cols-2 gap-3')}>
          {/* Company Field */}
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn('text-sm', compact && 'sr-only')}>
                  Company <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Company name"
                      className="pr-3"
                      style={{ paddingLeft: '0.75rem' }}
                      {...field}
                      value={field.value || ''}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company Size */}
          {showCompanySize && (
            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn('text-sm', compact && 'sr-only')}>
                    Company Size <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Primary Interest */}
        {showInterest && (
          <FormField
            control={form.control}
            name="primaryInterest"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn('text-sm', compact && 'sr-only')}>
                  Primary Interest
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="What are you looking for?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrugated">Corrugated Boxes & Cartons</SelectItem>
                    <SelectItem value="mailers">Mailers & Envelopes</SelectItem>
                    <SelectItem value="flexible">Flexible Packaging & Pouches</SelectItem>
                    <SelectItem value="food">Food Packaging</SelectItem>
                    <SelectItem value="labels">Labels & Tags</SelectItem>
                    <SelectItem value="sustainable">Sustainable Packaging</SelectItem>
                    <SelectItem value="multiple">Multiple Categories</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Referral Source */}
        {showReferralSource && (
          <FormField
            control={form.control}
            name="referralSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">How did you hear about us?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Hidden role field - uses the default from props */}
        <input type="hidden" {...form.register('role')} />

        {/* Submit Button */}
        <Button
          type="submit"
          className={cn(
            'w-full font-semibold',
            compact ? 'h-11' : 'h-12'
          )}
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              Reserve My Spot
              <Sparkles className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By joining, you agree to receive updates. No spam, ever.
        </p>
      </form>
    </Form>
  );
}
