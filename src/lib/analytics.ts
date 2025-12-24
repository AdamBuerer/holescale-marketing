/**
 * Comprehensive Analytics Utility
 * 
 * Provides detailed tracking for:
 * - Custom events
 * - E-commerce (subscriptions)
 * - Scroll depth
 * - Time on page
 * - Form interactions
 * - Outbound links
 * - File downloads
 * - Error tracking
 * - Performance metrics
 * - User journey
 */

// ============================================================================
// Types
// ============================================================================

export interface AnalyticsEvent {
  event_name: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_category2?: string;
  price?: number;
  quantity?: number;
}

export interface EcommerceTransaction {
  transaction_id: string;
  value: number;
  currency?: string;
  items: EcommerceItem[];
  coupon?: string;
  shipping?: number;
  tax?: number;
}

export interface PageViewParams {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  content_group1?: string; // Section (e.g., "Marketing", "Blog", "Resources")
  content_group2?: string; // Category (e.g., "Pricing", "Features")
  content_group3?: string; // Subcategory
  content_group4?: string; // Author/Tag
  content_group5?: string; // Custom metadata
}

// ============================================================================
// Core Analytics Functions
// ============================================================================

/**
 * Check if analytics is loaded and ready
 */
export function isAnalyticsReady(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.gtag !== 'undefined' &&
         typeof window.clarity !== 'undefined';
}

/**
 * Wait for analytics to be ready, then execute callback
 */
export function whenAnalyticsReady(callback: () => void, timeout = 5000): void {
  if (isAnalyticsReady()) {
    callback();
    return;
  }

  let attempts = 0;
  const maxAttempts = timeout / 100;
  const interval = setInterval(() => {
    attempts++;
    if (isAnalyticsReady()) {
      clearInterval(interval);
      callback();
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.warn('[Analytics] Timeout waiting for analytics to load');
    }
  }, 100);
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent): void {
  whenAnalyticsReady(() => {
    if (window.gtag) {
      window.gtag('event', event.event_name, {
        event_category: event.event_category,
        event_label: event.event_label,
        value: event.value,
        ...Object.fromEntries(
          Object.entries(event).filter(([key]) => 
            !['event_name', 'event_category', 'event_label', 'value'].includes(key)
          )
        ),
      });
    }

    // Also send to Clarity
    if (window.clarity) {
      window.clarity('event', event.event_name);
    }
  });
}

/**
 * Track a page view with enhanced metadata
 */
export function trackPageView(params: PageViewParams = {}): void {
  whenAnalyticsReady(() => {
    if (window.gtag) {
      const pageParams: Record<string, unknown> = {
        page_title: params.page_title || document.title,
        page_location: params.page_location || window.location.href,
        page_path: params.page_path || window.location.pathname,
      };

      // Add content groups for better organization in GA4
      if (params.content_group1) pageParams.content_group1 = params.content_group1;
      if (params.content_group2) pageParams.content_group2 = params.content_group2;
      if (params.content_group3) pageParams.content_group3 = params.content_group3;
      if (params.content_group4) pageParams.content_group4 = params.content_group4;
      if (params.content_group5) pageParams.content_group5 = params.content_group5;

      window.gtag('event', 'page_view', pageParams);
    }
  });
}

/**
 * Track e-commerce purchase/transaction
 */
export function trackPurchase(transaction: EcommerceTransaction): void {
  whenAnalyticsReady(() => {
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transaction.transaction_id,
        value: transaction.value,
        currency: transaction.currency || 'USD',
        items: transaction.items,
        coupon: transaction.coupon,
        shipping: transaction.shipping,
        tax: transaction.tax,
      });
    }
  });
}

/**
 * Track subscription signup/upgrade
 */
export function trackSubscription(
  tier: string,
  price: number,
  currency = 'USD',
  isTrial = false
): void {
  trackEvent({
    event_name: isTrial ? 'begin_checkout' : 'purchase',
    event_category: 'Subscription',
    event_label: tier,
    value: price,
    currency,
    tier,
    is_trial: isTrial,
  });

  if (!isTrial) {
    trackPurchase({
      transaction_id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      value: price,
      currency,
      items: [{
        item_id: tier,
        item_name: `${tier} Subscription`,
        item_category: 'Subscription',
        price,
        quantity: 1,
      }],
    });
  }
}

// ============================================================================
// Form Tracking
// ============================================================================

/**
 * Track form start (when user begins filling)
 */
export function trackFormStart(formName: string, formLocation?: string): void {
  trackEvent({
    event_name: 'form_start',
    event_category: 'Form',
    event_label: formName,
    form_location: formLocation || window.location.pathname,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(
  formName: string,
  success: boolean,
  formLocation?: string,
  errorMessage?: string
): void {
  trackEvent({
    event_name: success ? 'form_submit' : 'form_error',
    event_category: 'Form',
    event_label: formName,
    form_location: formLocation || window.location.pathname,
    success,
    error_message: errorMessage,
  });
}

/**
 * Track form field interaction
 */
export function trackFormFieldInteraction(
  formName: string,
  fieldName: string,
  interactionType: 'focus' | 'blur' | 'change'
): void {
  trackEvent({
    event_name: 'form_field_interaction',
    event_category: 'Form',
    event_label: `${formName} - ${fieldName}`,
    interaction_type: interactionType,
    form_name: formName,
    field_name: fieldName,
  });
}

// ============================================================================
// Engagement Tracking
// ============================================================================

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: number): void {
  const milestones = [25, 50, 75, 90, 100];
  const milestone = milestones.find(m => depth >= m && depth < m + 1);
  
  if (milestone) {
    trackEvent({
      event_name: 'scroll',
      event_category: 'Engagement',
      event_label: `${milestone}%`,
      scroll_depth: milestone,
    });
  }
}

/**
 * Track time on page
 */
export function trackTimeOnPage(seconds: number): void {
  const milestones = [10, 30, 60, 120, 300, 600]; // 10s, 30s, 1m, 2m, 5m, 10m
  const milestone = milestones.find(m => seconds >= m && seconds < m + 10);
  
  if (milestone) {
    trackEvent({
      event_name: 'time_on_page',
      event_category: 'Engagement',
      event_label: `${milestone}s`,
      time_seconds: milestone,
    });
  }
}

/**
 * Track outbound link click
 */
export function trackOutboundLink(url: string, linkText?: string): void {
  trackEvent({
    event_name: 'click',
    event_category: 'Outbound Link',
    event_label: linkText || url,
    link_url: url,
    link_text: linkText,
  });
}

/**
 * Track file download
 */
export function trackDownload(fileName: string, fileType?: string, fileSize?: number): void {
  trackEvent({
    event_name: 'file_download',
    event_category: 'Download',
    event_label: fileName,
    file_name: fileName,
    file_type: fileType,
    file_size: fileSize,
  });
}

/**
 * Track video engagement (if you add videos)
 */
export function trackVideoEngagement(
  videoTitle: string,
  action: 'play' | 'pause' | 'complete' | 'progress',
  progress?: number
): void {
  trackEvent({
    event_name: 'video_' + action,
    event_category: 'Video',
    event_label: videoTitle,
    video_title: videoTitle,
    progress_percent: progress,
  });
}

// ============================================================================
// Content Tracking
// ============================================================================

/**
 * Track blog post view
 */
export function trackBlogView(
  postId: string,
  postTitle: string,
  author?: string,
  category?: string,
  tags?: string[]
): void {
  trackPageView({
    page_title: postTitle,
    content_group1: 'Blog',
    content_group2: category,
    content_group4: author,
  });

  trackEvent({
    event_name: 'view_item',
    event_category: 'Blog',
    event_label: postTitle,
    item_id: postId,
    item_name: postTitle,
    author,
    category,
    tags: tags?.join(','),
  });
}

/**
 * Track blog engagement
 */
export function trackBlogEngagement(
  postId: string,
  action: 'bookmark' | 'share' | 'comment' | 'read_complete',
  metadata?: Record<string, unknown>
): void {
  trackEvent({
    event_name: 'blog_' + action,
    event_category: 'Blog',
    event_label: postId,
    post_id: postId,
    ...metadata,
  });
}

/**
 * Track resource download
 */
export function trackResourceDownload(
  resourceName: string,
  resourceType: string,
  requiresForm = false
): void {
  trackEvent({
    event_name: 'resource_download',
    event_category: 'Resource',
    event_label: resourceName,
    resource_name: resourceName,
    resource_type: resourceType,
    requires_form: requiresForm,
  });
}

// ============================================================================
// Conversion Tracking
// ============================================================================

/**
 * Track waitlist signup
 */
export function trackWaitlistSignup(
  role: 'buyer' | 'supplier' | 'other',
  referralSource?: string,
  companySize?: string
): void {
  trackEvent({
    event_name: 'sign_up',
    event_category: 'Conversion',
    event_label: 'Waitlist',
    method: 'waitlist',
    role,
    referral_source: referralSource,
    company_size: companySize,
  });
}

/**
 * Track pricing tier view
 */
export function trackPricingTierView(tier: string, userType: 'buyer' | 'supplier'): void {
  trackEvent({
    event_name: 'view_item',
    event_category: 'Pricing',
    event_label: tier,
    tier,
    user_type: userType,
  });
}

/**
 * Track pricing tier click (subscribe button)
 */
export function trackPricingTierClick(tier: string, userType: 'buyer' | 'supplier'): void {
  trackEvent({
    event_name: 'select_item',
    event_category: 'Pricing',
    event_label: tier,
    tier,
    user_type: userType,
  });
}

/**
 * Track tool usage
 */
export function trackToolUsage(toolName: string, action?: string, result?: unknown): void {
  trackEvent({
    event_name: 'tool_usage',
    event_category: 'Tool',
    event_label: toolName,
    tool_name: toolName,
    action,
    result: result ? JSON.stringify(result) : undefined,
  });
}

// ============================================================================
// Error Tracking
// ============================================================================

/**
 * Track JavaScript errors
 */
export function trackError(
  error: Error | string,
  errorSource?: string,
  errorDetails?: Record<string, unknown>
): void {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  trackEvent({
    event_name: 'exception',
    event_category: 'Error',
    event_label: errorMessage,
    description: errorMessage,
    fatal: false,
    error_source: errorSource || 'unknown',
    error_stack: errorStack,
    ...errorDetails,
  });
}

// ============================================================================
// Performance Tracking
// ============================================================================

/**
 * Track page load performance
 */
export function trackPagePerformance(): void {
  if (typeof window === 'undefined' || !window.performance) return;

  whenAnalyticsReady(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const metrics = {
        dns_time: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp_time: navigation.connectEnd - navigation.connectStart,
        request_time: navigation.responseStart - navigation.requestStart,
        response_time: navigation.responseEnd - navigation.responseStart,
        dom_processing: navigation.domComplete - navigation.domInteractive,
        load_time: navigation.loadEventEnd - navigation.fetchStart,
        first_contentful_paint: 0,
        largest_contentful_paint: 0,
      };

      // Get FCP
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        metrics.first_contentful_paint = fcp.startTime;
      }

      // Get LCP (if available)
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number };
            if (lastEntry.renderTime) {
              metrics.largest_contentful_paint = lastEntry.renderTime;
            }
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP observer not supported
        }
      }

      trackEvent({
        event_name: 'page_performance',
        event_category: 'Performance',
        ...metrics,
      });
    }
  }, 3000);
}

// ============================================================================
// User Journey Tracking
// ============================================================================

/**
 * Track user journey step
 */
export function trackJourneyStep(
  step: string,
  stepNumber?: number,
  journeyName?: string
): void {
  trackEvent({
    event_name: 'journey_step',
    event_category: 'User Journey',
    event_label: step,
    step_name: step,
    step_number: stepNumber,
    journey_name: journeyName,
  });
}

// ============================================================================
// Utility: Auto-track common interactions
// ============================================================================

/**
 * Initialize automatic tracking for common interactions
 */
export function initAutoTracking(): void {
  if (typeof window === 'undefined') return;

  // Track outbound links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.href) {
      const url = new URL(link.href, window.location.origin);
      
      // Outbound link
      if (url.origin !== window.location.origin) {
        trackOutboundLink(link.href, link.textContent || undefined);
      }
      
      // File downloads
      const isDownload = link.download || 
                        link.href.match(/\.(pdf|doc|docx|xls|xlsx|csv|zip|rar|tar|gz)$/i);
      if (isDownload) {
        const fileName = link.download || link.href.split('/').pop() || 'unknown';
        trackDownload(fileName);
      }
    }
  });

  // Track scroll depth
  let maxScroll = 0;
  const scrollHandler = () => {
    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    );
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      trackScrollDepth(scrollPercent);
    }
  };
  
  let scrollTimeout: NodeJS.Timeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(scrollHandler, 100);
  }, { passive: true });

  // Track time on page
  const startTime = Date.now();
  const timeMilestones = [10, 30, 60, 120, 300, 600];
  let currentMilestone = 0;

  const timeInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    
    if (currentMilestone < timeMilestones.length && elapsed >= timeMilestones[currentMilestone]) {
      trackTimeOnPage(timeMilestones[currentMilestone]);
      currentMilestone++;
    }
    
    if (currentMilestone >= timeMilestones.length) {
      clearInterval(timeInterval);
    }
  }, 1000);

  // Track page performance
  if (document.readyState === 'complete') {
    trackPagePerformance();
  } else {
    window.addEventListener('load', () => {
      setTimeout(trackPagePerformance, 2000);
    });
  }

  // Track errors
  window.addEventListener('error', (event) => {
    trackError(event.error || event.message, 'javascript', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackError(
      event.reason instanceof Error ? event.reason : String(event.reason),
      'promise_rejection'
    );
  });
}

// Extend Window interface
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

