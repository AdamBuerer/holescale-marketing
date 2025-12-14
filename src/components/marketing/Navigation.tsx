import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, LayoutDashboard, ChevronDown, ChevronRight,
  Search, Shield, Zap, Package, DollarSign,
  Users, TrendingUp, BarChart3, Globe, Target,
  FileText, Send, MessageSquare, CheckCircle,
  BookOpen, HelpCircle, FileQuestion,
  ArrowRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/ui/logo';
import { appLinks } from '@/lib/urls';
import { cn } from '@/lib/utils';

type MenuType = 'solutions' | 'product' | 'resources' | null;

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [mobileActiveMenu, setMobileActiveMenu] = useState<MenuType>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 800 });
  const navRef = useRef<HTMLElement>(null);
  const solutionsBtnRef = useRef<HTMLButtonElement>(null);
  const productBtnRef = useRef<HTMLButtonElement>(null);
  const resourcesBtnRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, hasRole } = useAuth();

  // Calculate dropdown position based on trigger button
  const calculateDropdownPosition = useCallback((btnRef: React.RefObject<HTMLButtonElement | null>, menuWidth: number) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Center the dropdown on the button, but keep it within viewport bounds
    let left = rect.left + rect.width / 2 - menuWidth / 2;

    // Ensure dropdown doesn't go off the left edge
    if (left < 16) left = 16;
    // Ensure dropdown doesn't go off the right edge
    if (left + menuWidth > viewportWidth - 16) {
      left = viewportWidth - menuWidth - 16;
    }

    setDropdownPosition({
      top: rect.bottom + 4,
      left,
      width: menuWidth,
    });
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const openMenu = useCallback((menu: MenuType) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Calculate position based on which menu
    if (menu === 'solutions') {
      calculateDropdownPosition(solutionsBtnRef, 800);
    } else if (menu === 'product') {
      calculateDropdownPosition(productBtnRef, 700);
    } else if (menu === 'resources') {
      calculateDropdownPosition(resourcesBtnRef, 500);
    }
    setActiveMenu(menu);
  }, [calculateDropdownPosition]);

  const scheduleClose = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const getDashboardLink = () => {
    if (hasRole('admin')) return `${appLinks.dashboard.replace('/dashboard', '/admin/dashboard')}`;
    if (hasRole('supplier')) return `${appLinks.dashboard.replace('/dashboard', '/supplier/dashboard')}`;
    return `${appLinks.dashboard.replace('/dashboard', '/buyer/dashboard')}`;
  };

  const closeAllMenus = () => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    setMobileActiveMenu(null);
  };

  return (
    <nav
      ref={navRef}
      className="bg-background shadow-sm sticky top-0 z-50 border-b"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0" aria-label="HoleScale - Go to homepage">
            <Logo variant="auto" width={110} className="md:w-[120px] lg:w-[140px]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2" role="menubar">

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('solutions')}
              onMouseLeave={scheduleClose}
              role="none"
            >
              <button
                ref={solutionsBtnRef}
                type="button"
                onClick={() => activeMenu === 'solutions' ? setActiveMenu(null) : openMenu('solutions')}
                onFocus={() => openMenu('solutions')}
                className={cn(
                  "flex items-center gap-1 px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all",
                  activeMenu === 'solutions'
                    ? "text-primary bg-primary/5"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
                aria-expanded={activeMenu === 'solutions'}
                aria-haspopup="true"
                aria-controls="solutions-menu"
              >
                Solutions
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", activeMenu === 'solutions' && "rotate-180")} aria-hidden="true" />
              </button>

              {/* Solutions Mega Menu */}
              <div
                id="solutions-menu"
                className={cn(
                  "fixed bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden transition-all duration-200",
                  activeMenu === 'solutions'
                    ? "opacity-100 visible translate-y-0 z-[9999]"
                    : "opacity-0 invisible -translate-y-2 pointer-events-none z-[-1]"
                )}
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: '800px',
                }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                role="menu"
                aria-label="Solutions menu"
              >
                <div className="grid grid-cols-2 divide-x divide-border/50">
                  {/* For Buyers */}
                  <div className="p-6">
                    <Link
                      to="/for-buyers"
                      onClick={closeAllMenus}
                      className="group flex items-center gap-3 mb-5"
                      role="menuitem"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Package className="w-6 h-6 text-blue-500" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-bold text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                          For Buyers
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                        </span>
                        <span className="text-sm text-muted-foreground">Find your perfect packaging partner</span>
                      </div>
                    </Link>

                    <ul className="space-y-3" role="none">
                      <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <Search className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Smart Supplier Discovery</span>
                          <p className="text-xs text-muted-foreground mt-0.5">AI-powered matching finds suppliers that fit your exact needs</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-violet-500" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Verified Quality Assurance</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Every supplier is vetted with certifications validated</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-4 h-4 text-amber-500" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Competitive Pricing</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Compare quotes instantly from multiple suppliers</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* For Suppliers */}
                  <div className="p-6">
                    <Link
                      to="/for-suppliers"
                      onClick={closeAllMenus}
                      className="group flex items-center gap-3 mb-5"
                      role="menuitem"
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                        <Users className="w-6 h-6 text-indigo-500" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-bold text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                          For Suppliers
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                        </span>
                        <span className="text-sm text-muted-foreground">Grow your packaging business</span>
                      </div>
                    </Link>

                    <ul className="space-y-3" role="none">
                      <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                          <Target className="w-4 h-4 text-cyan-500" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Qualified Lead Flow</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Get matched with buyers actively seeking your capabilities</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-rose-500" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Revenue Growth Tools</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Analytics, CRM, and tools to scale your operations</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-teal-500" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Expand Your Reach</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Access new markets and buyer segments nationwide</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('product')}
              onMouseLeave={scheduleClose}
              role="none"
            >
              <button
                ref={productBtnRef}
                type="button"
                onClick={() => activeMenu === 'product' ? setActiveMenu(null) : openMenu('product')}
                onFocus={() => openMenu('product')}
                className={cn(
                  "flex items-center gap-1 px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all",
                  activeMenu === 'product'
                    ? "text-primary bg-primary/5"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
                aria-expanded={activeMenu === 'product'}
                aria-haspopup="true"
                aria-controls="product-menu"
              >
                Product
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", activeMenu === 'product' && "rotate-180")} aria-hidden="true" />
              </button>

              {/* Product Mega Menu */}
              <div
                id="product-menu"
                className={cn(
                  "fixed bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden transition-all duration-200",
                  activeMenu === 'product'
                    ? "opacity-100 visible translate-y-0 z-[9999]"
                    : "opacity-0 invisible -translate-y-2 pointer-events-none z-[-1]"
                )}
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: '700px',
                }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                role="menu"
                aria-label="Product menu"
              >
                {/* How it Works - Visual Section */}
                <Link
                  to="/how-it-works"
                  onClick={closeAllMenus}
                  className="block p-6 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/50 hover:from-primary/10 transition-colors group"
                  role="menuitem"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
                    <span className="font-bold text-lg group-hover:text-primary transition-colors">How it Works</span>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                  </div>

                  {/* Visual Steps - SEO optimized with semantic markup */}
                  <ol className="flex items-center justify-between gap-2" aria-label="How HoleScale works in 4 steps">
                    <li className="flex-1 text-center p-3 rounded-xl bg-background/80 border border-border/50 group-hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-medium">Post RFQ</span>
                    </li>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    <li className="flex-1 text-center p-3 rounded-xl bg-background/80 border border-border/50 group-hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <Send className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-medium">Get Quotes</span>
                    </li>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    <li className="flex-1 text-center p-3 rounded-xl bg-background/80 border border-border/50 group-hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <MessageSquare className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-medium">Compare</span>
                    </li>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    <li className="flex-1 text-center p-3 rounded-xl bg-background/80 border border-border/50 group-hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-medium">Order</span>
                    </li>
                  </ol>
                </Link>

                {/* Features & Pricing Links */}
                <div className="grid grid-cols-2 divide-x divide-border/50">
                  <Link
                    to="/features"
                    onClick={closeAllMenus}
                    className="group p-5 hover:bg-muted/30 transition-colors"
                    role="menuitem"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                        <Zap className="w-5 h-5 text-violet-500" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                          Features
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                        </span>
                        <p className="text-sm text-muted-foreground">RFQ management, analytics, messaging & more</p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/pricing"
                    onClick={closeAllMenus}
                    className="group p-5 hover:bg-muted/30 transition-colors"
                    role="menuitem"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                        <BarChart3 className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                          Pricing
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                        </span>
                        <p className="text-sm text-muted-foreground">Free for buyers, competitive rates for suppliers</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('resources')}
              onMouseLeave={scheduleClose}
              role="none"
            >
              <button
                ref={resourcesBtnRef}
                type="button"
                onClick={() => activeMenu === 'resources' ? setActiveMenu(null) : openMenu('resources')}
                onFocus={() => openMenu('resources')}
                className={cn(
                  "flex items-center gap-1 px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all",
                  activeMenu === 'resources'
                    ? "text-primary bg-primary/5"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
                aria-expanded={activeMenu === 'resources'}
                aria-haspopup="true"
                aria-controls="resources-menu"
              >
                Resources
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", activeMenu === 'resources' && "rotate-180")} aria-hidden="true" />
              </button>

              {/* Resources Mega Menu */}
              <div
                id="resources-menu"
                className={cn(
                  "fixed bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden transition-all duration-200",
                  activeMenu === 'resources'
                    ? "opacity-100 visible translate-y-0 z-[9999]"
                    : "opacity-0 invisible -translate-y-2 pointer-events-none z-[-1]"
                )}
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: '500px',
                }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                role="menu"
                aria-label="Resources menu"
              >
                {/* Featured - Blog */}
                <Link
                  to="/blog"
                  onClick={closeAllMenus}
                  className="group block p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50 hover:from-primary/15 transition-colors"
                  role="menuitem"
                >
                  <article className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <BookOpen className="w-7 h-7 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg group-hover:text-primary transition-colors">Blog</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-primary text-primary-foreground rounded">New</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Industry insights, guides, and packaging trends</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </article>
                </Link>

                {/* Other Resources */}
                <nav className="p-4 space-y-1" aria-label="Resource links">
                  <Link
                    to="/faq"
                    onClick={closeAllMenus}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    role="menuitem"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium group-hover:text-primary transition-colors">FAQ</span>
                      <p className="text-xs text-muted-foreground">Common questions answered</p>
                    </div>
                  </Link>
                  <Link
                    to="/glossary"
                    onClick={closeAllMenus}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    role="menuitem"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <FileQuestion className="w-5 h-5 text-cyan-500" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium group-hover:text-primary transition-colors">Glossary</span>
                      <p className="text-xs text-muted-foreground">Packaging terminology explained</p>
                    </div>
                  </Link>
                </nav>

                {/* Category Quick Links - SEO optimized */}
                <div className="px-5 py-4 bg-muted/30 border-t border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Popular Topics</p>
                  <nav className="flex flex-wrap gap-2" aria-label="Blog categories">
                    <Link
                      to="/blog/category/buyer-guides"
                      onClick={closeAllMenus}
                      className="px-3 py-1.5 text-xs font-medium bg-background rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                      Buyer Guides
                    </Link>
                    <Link
                      to="/blog/category/supplier-success"
                      onClick={closeAllMenus}
                      className="px-3 py-1.5 text-xs font-medium bg-background rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                      Supplier Success
                    </Link>
                    <Link
                      to="/blog/category/industry-insights"
                      onClick={closeAllMenus}
                      className="px-3 py-1.5 text-xs font-medium bg-background rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                      Industry Insights
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {user ? (
              <a href={getDashboardLink()} aria-label="Go to your dashboard">
                <Button size="sm" className="gap-2 text-sm whitespace-nowrap">
                  <LayoutDashboard className="w-4 h-4 hidden xl:block" aria-hidden="true" />
                  <span className="hidden xl:inline">Go to Dashboard</span>
                  <span className="xl:hidden">Dashboard</span>
                </Button>
              </a>
            ) : (
              <>
                <a href={appLinks.login} aria-label="Log in to your account">
                  <Button variant="ghost" size="sm" className="gap-2 text-sm whitespace-nowrap">
                    Log in
                  </Button>
                </a>
                <Link to="/waitlist" aria-label="Join the HoleScale waitlist">
                  <Button size="sm" className="gap-2 text-sm whitespace-nowrap">
                    Join Waitlist
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-card border-t" role="navigation" aria-label="Mobile navigation">
          <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">

            {/* Solutions Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileActiveMenu(mobileActiveMenu === 'solutions' ? null : 'solutions')}
                className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent font-medium"
                aria-expanded={mobileActiveMenu === 'solutions'}
              >
                Solutions
                <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", mobileActiveMenu === 'solutions' && "rotate-180")} aria-hidden="true" />
              </button>
              <div className={cn(
                "overflow-hidden transition-all duration-200",
                mobileActiveMenu === 'solutions' ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="pl-4 py-2 space-y-1">
                  <Link to="/for-buyers" onClick={closeAllMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <Package className="w-5 h-5 text-blue-500" aria-hidden="true" />
                    <div>
                      <span className="font-medium block">For Buyers</span>
                      <span className="text-xs text-muted-foreground">Find packaging partners</span>
                    </div>
                  </Link>
                  <Link to="/for-suppliers" onClick={closeAllMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <Users className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                    <div>
                      <span className="font-medium block">For Suppliers</span>
                      <span className="text-xs text-muted-foreground">Grow your business</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Product Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileActiveMenu(mobileActiveMenu === 'product' ? null : 'product')}
                className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent font-medium"
                aria-expanded={mobileActiveMenu === 'product'}
              >
                Product
                <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", mobileActiveMenu === 'product' && "rotate-180")} aria-hidden="true" />
              </button>
              <div className={cn(
                "overflow-hidden transition-all duration-200",
                mobileActiveMenu === 'product' ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="pl-4 py-2 space-y-1">
                  <Link to="/how-it-works" onClick={closeAllMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
                    <span className="font-medium">How it Works</span>
                  </Link>
                  <Link to="/features" onClick={closeAllMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <Zap className="w-5 h-5 text-violet-500" aria-hidden="true" />
                    <span className="font-medium">Features</span>
                  </Link>
                  <Link to="/pricing" onClick={closeAllMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <BarChart3 className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                    <span className="font-medium">Pricing</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Resources Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileActiveMenu(mobileActiveMenu === 'resources' ? null : 'resources')}
                className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent font-medium"
                aria-expanded={mobileActiveMenu === 'resources'}
              >
                Resources
                <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", mobileActiveMenu === 'resources' && "rotate-180")} aria-hidden="true" />
              </button>
              <div className={cn(
                "overflow-hidden transition-all duration-200",
                mobileActiveMenu === 'resources' ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="pl-4 py-2 space-y-1">
                  <Link to="/blog" onClick={closeAllMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
                    <span className="font-medium">Blog</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-primary text-primary-foreground rounded">New</span>
                  </Link>
                  <Link to="/faq" onClick={closeAllMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <HelpCircle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                    <span className="font-medium">FAQ</span>
                  </Link>
                  <Link to="/glossary" onClick={closeAllMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <FileQuestion className="w-5 h-5 text-cyan-500" aria-hidden="true" />
                    <span className="font-medium">Glossary</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 space-y-2 border-t mt-4">
              {user ? (
                <a href={getDashboardLink()} onClick={closeAllMenus} className="block">
                  <Button className="w-full gap-2" size="sm">
                    <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                    Go to Dashboard
                  </Button>
                </a>
              ) : (
                <>
                  <a href={appLinks.login} onClick={closeAllMenus} className="block">
                    <Button variant="ghost" className="w-full" size="sm">Log in</Button>
                  </a>
                  <Link to="/waitlist" onClick={closeAllMenus} className="block">
                    <Button className="w-full" size="sm">Join Waitlist</Button>
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
