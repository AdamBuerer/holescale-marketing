import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Marketing pages
import Home from './pages/Home'
import About from './pages/About'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import ForBuyers from './pages/ForBuyers'
import ForSuppliers from './pages/ForSuppliers'
import HowItWorks from './pages/HowItWorks'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import BlogCategory from './pages/BlogCategory'
import BlogTag from './pages/BlogTag'
import BlogAuthor from './pages/BlogAuthor'
import Resources from './pages/Resources'
import Waitlist from './pages/Waitlist'
import Glossary from './pages/Glossary'
import Privacy from './pages/Privacy'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Investors from './pages/Investors'
import NotFound from './pages/NotFound'

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
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/investors" element={<Investors />} />

            {/* Redirect app routes to app.holescale.com */}
            <Route path="/auth" element={<RedirectToApp />} />
            <Route path="/auth/*" element={<RedirectToApp />} />
            <Route path="/buyer/*" element={<RedirectToApp />} />
            <Route path="/supplier/*" element={<RedirectToApp />} />
            <Route path="/admin/*" element={<RedirectToApp />} />
            <Route path="/settings/*" element={<RedirectToApp />} />
            <Route path="/messages/*" element={<RedirectToApp />} />
            <Route path="/orders/*" element={<RedirectToApp />} />
            <Route path="/rfq/*" element={<RedirectToApp />} />


            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  )
}
