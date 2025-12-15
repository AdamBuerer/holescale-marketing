import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Critical pages - load immediately
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Marketing pages - lazy loaded
const About = lazy(() => import('./pages/About'))
const Features = lazy(() => import('./pages/Features'))
const Pricing = lazy(() => import('./pages/Pricing'))
const ForBuyers = lazy(() => import('./pages/ForBuyers'))
const ForSuppliers = lazy(() => import('./pages/ForSuppliers'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const BlogCategory = lazy(() => import('./pages/BlogCategory'))
const BlogTag = lazy(() => import('./pages/BlogTag'))
const BlogAuthor = lazy(() => import('./pages/BlogAuthor'))
const Resources = lazy(() => import('./pages/Resources'))
const Waitlist = lazy(() => import('./pages/Waitlist'))
const Glossary = lazy(() => import('./pages/Glossary'))
const GlossaryTerm = lazy(() => import('./pages/GlossaryTerm'))
const GetQuotes = lazy(() => import('./pages/GetQuotes'))
const UnitCostCalculator = lazy(() => import('./pages/tools/UnitCostCalculator'))
const TaxCalculator = lazy(() => import('./pages/tools/TaxCalculator'))
const Privacy = lazy(() => import('./pages/Privacy'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const Investors = lazy(() => import('./pages/Investors'))

// Subscription pages - lazy loaded
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'))
const BillingSettings = lazy(() => import('./pages/BillingSettings'))
const UsageDashboard = lazy(() => import('./pages/UsageDashboard'))

// Admin pages - lazy loaded
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions'))
const AdminSubscriptionDetail = lazy(() => import('./pages/admin/AdminSubscriptionDetail'))
const AdminRevenue = lazy(() => import('./pages/admin/AdminRevenue'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
)

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

// Redirect component for app routes that accidentally hit marketing site
function RedirectToApp() {
  const path = window.location.pathname + window.location.search
  window.location.href = `https://app.holescale.com${path}`
  return <div className="flex items-center justify-center min-h-screen">Redirecting to app...</div>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
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
          <Toaster />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  )
}
