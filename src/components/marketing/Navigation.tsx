import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, LayoutDashboard, ChevronDown, ChevronRight,
  // For Buyers icons
  Search, Shield, Zap, Package, DollarSign, Clock,
  // For Suppliers icons
  Users, TrendingUp, BarChart3, Globe, Target, Handshake,
  // How it Works icons
  FileText, Send, MessageSquare, CheckCircle,
  // Resources icons
  BookOpen, HelpCircle, FileQuestion, Lightbulb,
  // Other
  ArrowRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/ui/logo';
import { appLinks } from '@/lib/urls';
import { cn } from '@/lib/utils';

type MenuType = 'solutions' | 'product' | 'resources' | null;

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [mobileActiveMenu, setMobileActiveMenu] = useState<MenuType>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, hasRole } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (menu: MenuType) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  const getDashboardLink = () => {
    if (hasRole('admin')) return `${appLinks.dashboard.replace('/dashboard', '/admin/dashboard')}`;
    if (hasRole('supplier')) return `${appLinks.dashboard.replace('/dashboard', '/supplier/dashboard')}`;
    return `${appLinks.dashboard.replace('/dashboard', '/buyer/dashboard')}`;
  };

  const closeMenus = () => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    setMobileActiveMenu(null);
  };

  return (
    <nav className="bg-background shadow-sm sticky top-0 z-50 border-b min-h-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 min-h-0 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <Logo variant="auto" width={110} className="md:w-[120px] lg:w-[140px]" />
          </Link>

          {/* Desktop Navigation */}
          <div ref={menuRef} className="hidden lg:flex items-center gap-1 xl:gap-2">

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveMenu(activeMenu === 'solutions' ? null : 'solutions')}
                className={cn(
                  "flex items-center gap-1 px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all",
                  activeMenu === 'solutions'
                    ? "text-primary bg-primary/5"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
              >
                Solutions
                <ChevronDown className={cn("w-4 h-4 transition-transform", activeMenu === 'solutions' && "rotate-180")} />
              </button>

              {/* Solutions Mega Menu */}
              <div className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[800px] bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden transition-all duration-200",
                activeMenu === 'solutions'
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              )}>
                <div className="grid grid-cols-2 divide-x divide-border/50">
                  {/* For Buyers */}
                  <div className="p-6">
                    <Link
                      to="/for-buyers"
                      onClick={closeMenus}
                      className="group flex items-center gap-3 mb-5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Package className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <span className="font-bold text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                          For Buyers
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </span>
                        <span className="text-sm text-muted-foreground">Find your perfect packaging partner</span>
                      </div>
                    </Link>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <Search className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Smart Supplier Discovery</span>
                          <p className="text-xs text-muted-foreground mt-0.5">AI-powered matching finds suppliers that fit your exact needs</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-violet-500" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Verified Quality Assurance</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Every supplier is vetted with certifications validated</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Competitive Pricing</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Compare quotes instantly from multiple suppliers</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* For Suppliers */}
                  <div className="p-6">
                    <Link
                      to="/for-suppliers"
                      onClick={closeMenus}
                      className="group flex items-center gap-3 mb-5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                        <Users className="w-6 h-6 text-indigo-500" />
                      </div>
                      <div>
                        <span className="font-bold text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                          For Suppliers
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </span>
                        <span className="text-sm text-muted-foreground">Grow your packaging business</span>
                      </div>
                    </Link>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                          <Target className="w-4 h-4 text-cyan-500" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Qualified Lead Flow</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Get matched with buyers actively seeking your capabilities</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-rose-500" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Revenue Growth Tools</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Analytics, CRM, and tools to scale your operations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-teal-500" />
                        </div>
                        <div>
                          <span className="font-medium text-sm">Expand Your Reach</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Access new markets and buyer segments nationwide</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('product')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveMenu(activeMenu === 'product' ? null : 'product')}
                className={cn(
                  "flex items-center gap-1 px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all",
                  activeMenu === 'product'
                    ? "text-primary bg-primary/5"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
              >
                Product
                <ChevronDown className={cn("w-4 h-4 transition-transform", activeMenu === 'product' && "rotate-180")} />
              </button>

              {/* Product Mega Menu */}
              <div className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden transition-all duration-200",
                activeMenu === 'product'
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              )}>
                {/* How it Works - Visual Section */}
                <div className="p-6 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/50">
                  <Link to="/how-it-works" onClick={closeMenus} className="group">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg group-hover:text-primary transition-colors">How it Works</span>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>

                    {/* Visual Steps */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 text-center p-3 rounded-xl bg-background/80 border border-border/50 group-hover:border-primary/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-medium">Post RFQ</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 text-center p-3 rounded-xl bg-background/80 border border-border/50 group-hover:border-primary/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                          <Send className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-medium">Get Quotes</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 text-center p-3 rounded-xl bg-background/80 border border-border/50 group-hover:border-primary/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-medium">Compare</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 text-center p-3 rounded-xl bg-background/80 border border-border/50 group-hover:border-primary/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="text-xs font-medium">Order</span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Features & Pricing Links */}
                <div className="grid grid-cols-2 divide-x divide-border/50">
                  <Link
                    to="/features"
                    onClick={closeMenus}
                    className="group p-5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                        <Zap className="w-5 h-5 text-violet-500" />
                      </div>
                      <div>
                        <span className="font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                          Features
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </span>
                        <p className="text-sm text-muted-foreground">RFQ management, analytics, messaging & more</p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/pricing"
                    onClick={closeMenus}
                    className="group p-5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                        <BarChart3 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <span className="font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                          Pricing
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
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
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveMenu(activeMenu === 'resources' ? null : 'resources')}
                className={cn(
                  "flex items-center gap-1 px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all",
                  activeMenu === 'resources'
                    ? "text-primary bg-primary/5"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
              >
                Resources
                <ChevronDown className={cn("w-4 h-4 transition-transform", activeMenu === 'resources' && "rotate-180")} />
              </button>

              {/* Resources Mega Menu */}
              <div className={cn(
                "absolute top-full right-0 mt-2 w-[500px] bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden transition-all duration-200",
                activeMenu === 'resources'
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              )}>
                {/* Featured - Blog */}
                <Link
                  to="/blog"
                  onClick={closeMenus}
                  className="group block p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50 hover:from-primary/15 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <BookOpen className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg group-hover:text-primary transition-colors">Blog</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-primary text-primary-foreground rounded">New</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Industry insights, guides, and packaging trends</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>

                {/* Other Resources */}
                <div className="p-4 space-y-1">
                  <Link
                    to="/faq"
                    onClick={closeMenus}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium group-hover:text-primary transition-colors">FAQ</span>
                      <p className="text-xs text-muted-foreground">Common questions answered</p>
                    </div>
                  </Link>
                  <Link
                    to="/glossary"
                    onClick={closeMenus}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <FileQuestion className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium group-hover:text-primary transition-colors">Glossary</span>
                      <p className="text-xs text-muted-foreground">Packaging terminology explained</p>
                    </div>
                  </Link>
                </div>

                {/* Category Quick Links */}
                <div className="px-5 py-4 bg-muted/30 border-t border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Popular Topics</p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/blog/category/buyer-guides"
                      onClick={closeMenus}
                      className="px-3 py-1.5 text-xs font-medium bg-background rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                      Buyer Guides
                    </Link>
                    <Link
                      to="/blog/category/supplier-success"
                      onClick={closeMenus}
                      className="px-3 py-1.5 text-xs font-medium bg-background rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                      Supplier Success
                    </Link>
                    <Link
                      to="/blog/category/industry-insights"
                      onClick={closeMenus}
                      className="px-3 py-1.5 text-xs font-medium bg-background rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                      Industry Insights
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {user ? (
              <a href={getDashboardLink()}>
                <Button size="sm" className="gap-2 text-sm whitespace-nowrap">
                  <LayoutDashboard className="w-4 h-4 hidden xl:block" />
                  <span className="hidden xl:inline">Go to Dashboard</span>
                  <span className="xl:hidden">Dashboard</span>
                </Button>
              </a>
            ) : (
              <>
                <a href={appLinks.login}>
                  <Button variant="ghost" size="sm" className="gap-2 text-sm whitespace-nowrap">
                    Log in
                  </Button>
                </a>
                <Link to="/waitlist">
                  <Button size="sm" className="gap-2 text-sm whitespace-nowrap">
                    Join Waitlist
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t">
          <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">

            {/* Solutions Accordion */}
            <div>
              <button
                onClick={() => setMobileActiveMenu(mobileActiveMenu === 'solutions' ? null : 'solutions')}
                className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent font-medium"
              >
                Solutions
                <ChevronDown className={cn("w-5 h-5 transition-transform", mobileActiveMenu === 'solutions' && "rotate-180")} />
              </button>
              <div className={cn(
                "overflow-hidden transition-all",
                mobileActiveMenu === 'solutions' ? "max-h-[400px]" : "max-h-0"
              )}>
                <div className="pl-4 py-2 space-y-1">
                  <Link to="/for-buyers" onClick={closeMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <Package className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="font-medium block">For Buyers</span>
                      <span className="text-xs text-muted-foreground">Find packaging partners</span>
                    </div>
                  </Link>
                  <Link to="/for-suppliers" onClick={closeMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <Users className="w-5 h-5 text-indigo-500" />
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
                onClick={() => setMobileActiveMenu(mobileActiveMenu === 'product' ? null : 'product')}
                className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent font-medium"
              >
                Product
                <ChevronDown className={cn("w-5 h-5 transition-transform", mobileActiveMenu === 'product' && "rotate-180")} />
              </button>
              <div className={cn(
                "overflow-hidden transition-all",
                mobileActiveMenu === 'product' ? "max-h-[400px]" : "max-h-0"
              )}>
                <div className="pl-4 py-2 space-y-1">
                  <Link to="/how-it-works" onClick={closeMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-medium">How it Works</span>
                  </Link>
                  <Link to="/features" onClick={closeMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <Zap className="w-5 h-5 text-violet-500" />
                    <span className="font-medium">Features</span>
                  </Link>
                  <Link to="/pricing" onClick={closeMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Pricing</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Resources Accordion */}
            <div>
              <button
                onClick={() => setMobileActiveMenu(mobileActiveMenu === 'resources' ? null : 'resources')}
                className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent font-medium"
              >
                Resources
                <ChevronDown className={cn("w-5 h-5 transition-transform", mobileActiveMenu === 'resources' && "rotate-180")} />
              </button>
              <div className={cn(
                "overflow-hidden transition-all",
                mobileActiveMenu === 'resources' ? "max-h-[400px]" : "max-h-0"
              )}>
                <div className="pl-4 py-2 space-y-1">
                  <Link to="/blog" onClick={closeMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-medium">Blog</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-primary text-primary-foreground rounded">New</span>
                  </Link>
                  <Link to="/faq" onClick={closeMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <HelpCircle className="w-5 h-5 text-amber-500" />
                    <span className="font-medium">FAQ</span>
                  </Link>
                  <Link to="/glossary" onClick={closeMenus} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent">
                    <FileQuestion className="w-5 h-5 text-cyan-500" />
                    <span className="font-medium">Glossary</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 space-y-2 border-t mt-4">
              {user ? (
                <a href={getDashboardLink()} onClick={closeMenus} className="block">
                  <Button className="w-full gap-2" size="sm">
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Dashboard
                  </Button>
                </a>
              ) : (
                <>
                  <a href={appLinks.login} onClick={closeMenus} className="block">
                    <Button variant="ghost" className="w-full" size="sm">Log in</Button>
                  </a>
                  <Link to="/waitlist" onClick={closeMenus} className="block">
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
