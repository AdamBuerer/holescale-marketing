import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAnalyticsInit, usePageTracking } from '@/hooks/useAnalytics'
import { lazyWithRetry } from '@/lib/lazy-retry'
import { ErrorBoundary } from '@/components/ui/error-boundary'

// Critical pages - load immediately
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Marketing pages - lazy loaded with retry
const About = lazyWithRetry(() => import('./pages/About'))
const Features = lazyWithRetry(() => import('./pages/Features'))
const Pricing = lazyWithRetry(() => import('./pages/Pricing'))
const ForBuyers = lazyWithRetry(() => import('./pages/ForBuyers'))
const ForSuppliers = lazyWithRetry(() => import('./pages/ForSuppliers'))
const HowItWorks = lazyWithRetry(() => import('./pages/HowItWorks'))
const Contact = lazyWithRetry(() => import('./pages/Contact'))
const FAQ = lazyWithRetry(() => import('./pages/FAQ'))
const Blog = lazyWithRetry(() => import('./pages/Blog'))
const BlogPost = lazyWithRetry(() => import('./pages/BlogPost'))
const BlogCategory = lazyWithRetry(() => import('./pages/BlogCategory'))
const BlogTag = lazyWithRetry(() => import('./pages/BlogTag'))
const BlogAuthor = lazyWithRetry(() => import('./pages/BlogAuthor'))
const Resources = lazyWithRetry(() => import('./pages/Resources'))
const Waitlist = lazyWithRetry(() => import('./pages/Waitlist'))
const Glossary = lazyWithRetry(() => import('./pages/Glossary'))
const GlossaryTerm = lazyWithRetry(() => import('./pages/GlossaryTerm'))
const GetQuotes = lazyWithRetry(() => import('./pages/GetQuotes'))
const UnitCostCalculator = lazyWithRetry(() => import('./pages/tools/UnitCostCalculator'))
const TaxCalculator = lazyWithRetry(() => import('./pages/tools/TaxCalculator'))
const Privacy = lazyWithRetry(() => import('./pages/Privacy'))
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazyWithRetry(() => import('./pages/TermsOfService'))
const Investors = lazyWithRetry(() => import('./pages/Investors'))

// Subscription pages - lazy loaded with retry
const CheckoutSuccess = lazyWithRetry(() => import('./pages/CheckoutSuccess'))
const BillingSettings = lazyWithRetry(() => import('./pages/BillingSettings'))
const UsageDashboard = lazyWithRetry(() => import('./pages/UsageDashboard'))

// Admin pages - lazy loaded with retry
const AdminSubscriptions = lazyWithRetry(() => import('./pages/admin/AdminSubscriptions'))
const AdminSubscriptionDetail = lazyWithRetry(() => import('./pages/admin/AdminSubscriptionDetail'))
const AdminRevenue = lazyWithRetry(() => import('./pages/admin/AdminRevenue'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
)

// Create a client with optimized caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time, previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false, // Don't refetch on window focus for better performance
      refetchOnMount: false, // Use cached data if available
    },
  },
})

// Redirect component for app routes that accidentally hit marketing site
function RedirectToApp() {
  const path = window.location.pathname + window.location.search
  window.location.href = `https://app.holescale.com${path}`
  return <div className="flex items-center justify-center min-h-screen">Redirecting to app...</div>
}

// Analytics wrapper component
function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  useAnalyticsInit()
  usePageTracking()
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <AnalyticsWrapper>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Marketing Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/for-buyers" element={<ForBuyers />} />
                  <Route path="/for-suppliers" element={<ForSuppliers />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/blog/category/:slug" element={<BlogCategory />} />
                  <Route path="/blog/tag/:slug" element={<BlogTag />} />
                  <Route path="/blog/author/:slug" element={<BlogAuthor />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/waitlist" element={<Waitlist />} />
                  <Route path="/glossary" element={<Glossary />} />
                  <Route path="/glossary/:slug" element={<GlossaryTerm />} />
                  <Route path="/get-quotes" element={<GetQuotes />} />
                  <Route path="/buyers" element={<GetQuotes />} />
                  <Route path="/tools/unit-cost-calculator" element={<UnitCostCalculator />} />
                  <Route path="/tools/tax-calculator" element={<TaxCalculator />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/investors" element={<Investors />} />

                  {/* Subscription routes */}
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/settings/billing" element={<BillingSettings />} />
                  <Route path="/settings/usage" element={<UsageDashboard />} />

                  {/* Admin routes */}
                  <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
                  <Route path="/admin/subscriptions/:id" element={<AdminSubscriptionDetail />} />
                  <Route path="/admin/revenue" element={<AdminRevenue />} />

                  {/* Redirect other app routes to app.holescale.com */}
                  <Route path="/auth" element={<RedirectToApp />} />
                  <Route path="/auth/*" element={<RedirectToApp />} />
                  <Route path="/buyer/*" element={<RedirectToApp />} />
                  <Route path="/supplier/*" element={<RedirectToApp />} />
                  <Route path="/messages/*" element={<RedirectToApp />} />
                  <Route path="/orders/*" element={<RedirectToApp />} />
                  <Route path="/rfq/*" element={<RedirectToApp />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
            <Toaster />
          </AnalyticsWrapper>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  )
}
