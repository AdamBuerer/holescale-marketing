import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/ui/logo';

// Feature flag: Set to false to disable signups and show waitlist instead
const SIGNUPS_ENABLED = import.meta.env.VITE_SIGNUPS_ENABLED !== 'false';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (hasRole('admin')) return '/admin/dashboard';
    if (hasRole('supplier')) return '/supplier/dashboard';
    // Default to buyer dashboard if signed in but no specific role, or if buyer role exists
    return '/buyer/dashboard';
  };

  return (
    <nav className="bg-background shadow-sm sticky top-0 z-50 border-b min-h-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 min-h-0 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <Logo variant="auto" width={110} className="md:w-[120px] lg:w-[140px]" />
          </Link>

          {/* Desktop/Tablet Navigation - Responsive spacing */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Link
              to="/how-it-works"
              className="text-foreground/80 hover:text-primary font-medium text-sm xl:text-base whitespace-nowrap"
            >
              How it works
            </Link>
            <Link
              to="/features"
              className="text-foreground/80 hover:text-primary font-medium text-sm xl:text-base whitespace-nowrap"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-foreground/80 hover:text-primary font-medium text-sm xl:text-base whitespace-nowrap"
            >
              Pricing
            </Link>
            <Link
              to="/for-buyers"
              className="text-foreground/80 hover:text-primary font-medium text-sm xl:text-base whitespace-nowrap"
            >
              For Buyers
            </Link>
            <Link
              to="/for-suppliers"
              className="text-foreground/80 hover:text-primary font-medium text-sm xl:text-base whitespace-nowrap"
            >
              For Suppliers
            </Link>
            <Link
              to="/faq"
              className="text-foreground/80 hover:text-primary font-medium text-sm xl:text-base whitespace-nowrap"
            >
              FAQ
            </Link>
          </div>

          {/* CTA Buttons - Responsive */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {user ? (
              <Link to={getDashboardLink()}>
                <Button size="sm" className="gap-2 text-sm whitespace-nowrap" aria-label="Navigate to your dashboard">
                  <LayoutDashboard className="w-4 h-4 hidden xl:block" aria-hidden="true" />
                  <span className="hidden xl:inline">Go to Dashboard</span>
                  <span className="xl:hidden">Dashboard</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2 text-sm whitespace-nowrap" aria-label="Log in to your account">
                    Log in
                  </Button>
                </Link>
                <Link to="/waitlist">
                  <Button size="sm" className="gap-2 text-sm whitespace-nowrap" aria-label="Join the waitlist">
                    Join Waitlist
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile/Tablet menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent min-h-0 flex-shrink-0"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t" role="navigation" aria-label="Mobile navigation menu">
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link
              to="/how-it-works"
              className="block text-foreground hover:text-white font-medium py-2.5 px-3 rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it works
            </Link>
            <Link
              to="/features"
              className="block text-foreground hover:text-white font-medium py-2.5 px-3 rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block text-foreground hover:text-white font-medium py-2.5 px-3 rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/for-buyers"
              className="block text-foreground hover:text-white font-medium py-2.5 px-3 rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Buyers
            </Link>
            <Link
              to="/for-suppliers"
              className="block text-foreground hover:text-white font-medium py-2.5 px-3 rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Suppliers
            </Link>
            <Link
              to="/faq"
              className="block text-foreground hover:text-white font-medium py-2.5 px-3 rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="pt-3 space-y-2 border-t">
              {user ? (
                <Link to={getDashboardLink()} className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-2" size="sm" aria-label="Navigate to your dashboard">
                    <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full" size="sm" aria-label="Log in to your account">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/waitlist" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" size="sm" aria-label="Join the waitlist">
                      Join Waitlist
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
