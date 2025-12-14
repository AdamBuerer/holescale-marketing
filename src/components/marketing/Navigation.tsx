import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, ChevronDown, BookOpen, HelpCircle, FileText, Lightbulb, TrendingUp, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/ui/logo';
import { appLinks } from '@/lib/urls';
import { cn } from '@/lib/utils';

interface MegaMenuItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
}

const resourcesMenu: MegaMenuSection[] = [
  {
    title: 'Learn',
    items: [
      {
        title: 'Blog',
        description: 'Industry insights, guides, and packaging trends',
        href: '/blog',
        icon: BookOpen,
        badge: 'New',
      },
      {
        title: 'FAQ',
        description: 'Common questions about our platform',
        href: '/faq',
        icon: HelpCircle,
      },
      {
        title: 'Glossary',
        description: 'Packaging terminology explained',
        href: '/glossary',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Guides',
    items: [
      {
        title: 'Buyer Guides',
        description: 'Find the perfect packaging solution',
        href: '/blog/category/buyer-guides',
        icon: Package,
      },
      {
        title: 'Supplier Success',
        description: 'Grow your packaging business',
        href: '/blog/category/supplier-success',
        icon: TrendingUp,
      },
      {
        title: 'Industry Insights',
        description: 'Market trends and analysis',
        href: '/blog/category/industry-insights',
        icon: Lightbulb,
      },
    ],
  },
];

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, hasRole } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setResourcesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setResourcesOpen(false), 150);
  };

  const getDashboardLink = () => {
    if (hasRole('admin')) return `${appLinks.dashboard.replace('/dashboard', '/admin/dashboard')}`;
    if (hasRole('supplier')) return `${appLinks.dashboard.replace('/dashboard', '/supplier/dashboard')}`;
    return `${appLinks.dashboard.replace('/dashboard', '/buyer/dashboard')}`;
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

            {/* Resources Mega Menu */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className={cn(
                  "flex items-center gap-1 text-foreground/80 hover:text-primary font-medium text-sm xl:text-base whitespace-nowrap transition-colors",
                  resourcesOpen && "text-primary"
                )}
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
              >
                Resources
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  resourcesOpen && "rotate-180"
                )} />
              </button>

              {/* Mega Menu Dropdown */}
              <div
                className={cn(
                  "absolute top-full right-0 mt-2 w-[540px] bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden transition-all duration-200 origin-top-right",
                  resourcesOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}
                role="menu"
              >
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 border-b border-border/50">
                  <p className="text-sm font-semibold text-foreground">Resources & Guides</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Everything you need to succeed in packaging</p>
                </div>

                {/* Menu Sections */}
                <div className="grid grid-cols-2 gap-0 divide-x divide-border/50">
                  {resourcesMenu.map((section) => (
                    <div key={section.title} className="p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                        {section.title}
                      </p>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setResourcesOpen(false)}
                            className="group flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                            role="menuitem"
                          >
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                              <item.icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-primary text-primary-foreground rounded">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer CTA */}
                <div className="bg-muted/50 px-6 py-3 border-t border-border/50">
                  <Link
                    to="/blog"
                    onClick={() => setResourcesOpen(false)}
                    className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 group"
                  >
                    Browse all articles
                    <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons - Responsive */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {user ? (
              <a href={getDashboardLink()}>
                <Button size="sm" className="gap-2 text-sm whitespace-nowrap" aria-label="Navigate to your dashboard">
                  <LayoutDashboard className="w-4 h-4 hidden xl:block" aria-hidden="true" />
                  <span className="hidden xl:inline">Go to Dashboard</span>
                  <span className="xl:hidden">Dashboard</span>
                </Button>
              </a>
            ) : (
              <>
                <a href={appLinks.login}>
                  <Button variant="ghost" size="sm" className="gap-2 text-sm whitespace-nowrap" aria-label="Log in to your account">
                    Log in
                  </Button>
                </a>
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

            {/* Mobile Resources Accordion */}
            <div className="border-t border-border/50 pt-2 mt-2">
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className="w-full flex items-center justify-between text-foreground font-medium py-2.5 px-3 rounded-md hover:bg-accent transition-colors"
              >
                <span>Resources</span>
                <ChevronDown className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  mobileResourcesOpen && "rotate-180"
                )} />
              </button>

              <div className={cn(
                "overflow-hidden transition-all duration-200",
                mobileResourcesOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="pl-3 py-2 space-y-1">
                  {resourcesMenu.map((section) => (
                    <div key={section.title} className="mb-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                        {section.title}
                      </p>
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileResourcesOpen(false);
                          }}
                          className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent transition-colors"
                        >
                          <item.icon className="w-4 h-4 text-primary" />
                          <span className="text-foreground text-sm">{item.title}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-primary text-primary-foreground rounded">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 space-y-2 border-t">
              {user ? (
                <a href={getDashboardLink()} className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-2" size="sm" aria-label="Navigate to your dashboard">
                    <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                    Go to Dashboard
                  </Button>
                </a>
              ) : (
                <>
                  <a href={appLinks.login} className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full" size="sm" aria-label="Log in to your account">
                      Log in
                    </Button>
                  </a>
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
