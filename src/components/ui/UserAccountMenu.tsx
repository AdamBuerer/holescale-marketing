/**
 * User Account Menu Component
 *
 * Dropdown menu for authenticated users showing account management options,
 * subscription settings, and billing information.
 */

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { appLinks } from '@/lib/urls';
import { cn } from '@/lib/utils';

interface UserAccountMenuProps {
  className?: string;
}

export function UserAccountMenu({ className }: UserAccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, hasRole, signOut } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const getDashboardLink = () => {
    if (hasRole('admin')) return `${appLinks.dashboard.replace('/dashboard', '/admin/dashboard')}`;
    if (hasRole('supplier')) return `${appLinks.dashboard.replace('/dashboard', '/supplier/dashboard')}`;
    return `${appLinks.dashboard.replace('/dashboard', '/buyer/dashboard')}`;
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) return null;

  const userEmail = user.email || '';
  const userInitials = userEmail
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
          {userInitials}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-card rounded-lg shadow-xl border border-border z-50 overflow-hidden"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="text-sm font-medium truncate">{userEmail}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {hasRole('admin') ? 'Admin' : hasRole('supplier') ? 'Supplier' : 'Buyer'}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Dashboard */}
            <a
              href={getDashboardLink()}
              rel="nofollow"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
              role="menuitem"
            >
              <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Dashboard</span>
            </a>

            {/* Billing Settings */}
            <Link
              to="/settings/billing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
              role="menuitem"
            >
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Billing & Subscription</span>
            </Link>

            {/* Usage Dashboard */}
            <Link
              to="/settings/usage"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
              role="menuitem"
            >
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Usage & Limits</span>
            </Link>

            {/* Admin Menu Items */}
            {hasRole('admin') && (
              <>
                <div className="h-px bg-border my-2" role="separator" />

                <Link
                  to="/admin/subscriptions"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
                  role="menuitem"
                >
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Manage Subscriptions</span>
                </Link>

                <Link
                  to="/admin/revenue"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
                  role="menuitem"
                >
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Revenue Dashboard</span>
                </Link>
              </>
            )}

            <div className="h-px bg-border my-2" role="separator" />

            {/* Account Settings */}
            <a
              href={`${appLinks.dashboard.replace('/dashboard', '/settings')}`}
              rel="nofollow"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
              role="menuitem"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Account Settings</span>
            </a>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left"
              role="menuitem"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
