import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { logger } from "./logger";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if a name is valid (not null, not empty, and not a placeholder like "New User")
 */
function isValidName(name: string | null | undefined): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  if (!trimmed) return false;
  // Treat "New User" as a placeholder
  if (trimmed.toLowerCase() === 'new user') return false;
  return true;
}

/**
 * Formats a full name for display
 * "Adam Buerer" -> "Adam B"
 * "John" -> "John"
 * null/undefined -> null
 * "New User" -> null (treat as placeholder)
 */
export function formatDisplayName(fullName: string | null | undefined): string | null {
  if (!isValidName(fullName)) return null;
  const trimmed = fullName!.trim();
  
  // If name has multiple words, format as "First LastInitial" (no period)
  const parts = trimmed.split(/\s+/).filter(p => p.length > 0);
  if (parts.length >= 2) {
    const firstName = parts[0];
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${firstName} ${lastInitial}`;
  }
  
  // Single word name, return as-is
  return trimmed;
}

/**
 * Display context types for determining what information to show
 * - 'marketplace': Public contexts (supplier cards, listings, RFQ cards) - show company branding
 * - 'messaging': Private communication (messages, chat, conversations) - show personal info
 * - 'profile': Profile pages - show both but prioritize appropriately
 * - 'navigation': Header/navigation - show based on role conventions
 */
export type DisplayContext = 'marketplace' | 'messaging' | 'profile' | 'navigation';

/**
 * Centralized display name resolver
 * Determines the best display name based on profile data, role, and context
 * NEVER returns email username - always returns formatted name or fallback
 * 
 * Best Practices:
 * - Marketplace: Suppliers show company name, Buyers show company name (if available) or personal name
 * - Messaging: All users show personal name (more human, builds trust)
 * - Profile: Show appropriate name based on role (supplier=company, buyer/admin=personal)
 * - Navigation: Show based on role conventions (supplier=company, buyer=company if available else personal, admin=personal)
 * 
 * @param profile - User profile data
 * @param role - Current user role ('admin' | 'supplier' | 'buyer')
 * @param context - Display context ('marketplace' | 'messaging' | 'profile' | 'navigation')
 * @returns Formatted display name or "Account" as fallback
 */
export function getDisplayName(
  profile: { full_name: string | null; company_name: string | null } | null | undefined,
  role?: 'admin' | 'supplier' | 'buyer' | null,
  context: DisplayContext = 'navigation'
): string {
  // Debug logging (can be removed after confirming fix works)
  const debugLog = (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      logger.debug(`getDisplayName: ${message}`, data || {});
    }
  };

  // Return early if no profile
  if (!profile) {
    debugLog('No profile provided, returning "Account"');
    return "Account";
  }

  debugLog('Processing profile', {
    full_name: profile.full_name,
    company_name: profile.company_name,
    role,
    context,
    full_name_type: typeof profile.full_name,
    full_name_length: profile.full_name?.length,
    full_name_trimmed: profile.full_name?.trim()
  });
  
  // CRITICAL: ALWAYS prioritize full_name first (the "Profile Name" field)
  // This ensures the name from the profile form is always used when available
  // Check if full_name exists and has content (but skip "New User" placeholder)
  if (isValidName(profile.full_name)) {
    const formatted = formatDisplayName(profile.full_name);
    const result = formatted || profile.full_name!.trim();
    debugLog('Using full_name from profile (ALWAYS prioritized)', { 
      original: profile.full_name, 
      formatted: result,
      context 
    });
    return result;
  }

  // MESSAGING CONTEXT: Always show personal name (more human, builds trust in private communication)
  if (context === 'messaging') {
    if (isValidName(profile.full_name)) {
      const formatted = formatDisplayName(profile.full_name);
      const result = formatted || profile.full_name!.trim();
      debugLog('Messaging context: Using formatted full name', result);
      return result;
    }
    if (profile.company_name?.trim()) {
      const result = profile.company_name.trim();
      debugLog('Messaging context: Fallback to company name', result);
      return result;
    }
  }

  // MARKETPLACE CONTEXT: Show company branding for suppliers/buyers
  if (context === 'marketplace') {
    // Suppliers: Always show company name (branding is critical)
    if (role === 'supplier') {
      if (profile.company_name?.trim()) {
        const result = profile.company_name.trim();
        debugLog('Marketplace/Supplier: Using company name', result);
        return result;
      }
      if (isValidName(profile.full_name)) {
        const formatted = formatDisplayName(profile.full_name);
        const result = formatted || profile.full_name!.trim();
        debugLog('Marketplace/Supplier: Fallback to formatted full name', result);
        return result;
      }
    }
    // Buyers: Show company name if available, otherwise personal name
    if (role === 'buyer') {
      if (profile.company_name?.trim()) {
        const result = profile.company_name.trim();
        debugLog('Marketplace/Buyer: Using company name', result);
        return result;
      }
      if (isValidName(profile.full_name)) {
        const formatted = formatDisplayName(profile.full_name);
        const result = formatted || profile.full_name!.trim();
        debugLog('Marketplace/Buyer: Using formatted full name', result);
        return result;
      }
    }
    // Admins: Show personal name
    if (role === 'admin' && isValidName(profile.full_name)) {
      const formatted = formatDisplayName(profile.full_name);
      const result = formatted || profile.full_name!.trim();
      debugLog('Marketplace/Admin: Using formatted full name', result);
      return result;
    }
  }

  // PROFILE CONTEXT: Show appropriate name based on role
  if (context === 'profile') {
    // Suppliers: Show company name prominently
    if (role === 'supplier') {
      if (profile.company_name?.trim()) {
        const result = profile.company_name.trim();
        debugLog('Profile/Supplier: Using company name', result);
        return result;
      }
      if (isValidName(profile.full_name)) {
        const formatted = formatDisplayName(profile.full_name);
        const result = formatted || profile.full_name!.trim();
        debugLog('Profile/Supplier: Fallback to formatted full name', result);
        return result;
      }
    }
    // Buyers/Admins: Show personal name
    if (isValidName(profile.full_name)) {
      const formatted = formatDisplayName(profile.full_name);
      const result = formatted || profile.full_name!.trim();
      debugLog('Profile/Buyer/Admin: Using formatted full name', result);
      return result;
    }
    if (profile.company_name?.trim()) {
      const result = profile.company_name.trim();
      debugLog('Profile/Buyer/Admin: Fallback to company name', result);
      return result;
    }
  }

  // NAVIGATION CONTEXT (default): Show based on role conventions
  // Suppliers: Company name (branding)
  // Buyers: Company name if available, otherwise personal name
  // Admins: Personal name
  
  // CRITICAL: Always prioritize full_name for navigation context
  // This ensures the profile name from the form is always used
  if (isValidName(profile.full_name)) {
    const formatted = formatDisplayName(profile.full_name);
    const result = formatted || profile.full_name!.trim();
    debugLog('Navigation: Using formatted full name (prioritized)', result);
    return result;
  }
  
  // For suppliers, show company name as fallback
  if (role === 'supplier' && profile.company_name?.trim()) {
    const result = profile.company_name.trim();
    debugLog('Navigation/Supplier: Fallback to company name', result);
    return result;
  }
  
  // For buyers/admins, show company name as fallback if available
  if (profile.company_name?.trim()) {
    const result = profile.company_name.trim();
    debugLog('Navigation/Buyer/Admin: Fallback to company name', result);
    return result;
  }
  
  // Final fallback - NEVER use email
  debugLog('No name found, returning "Account"', {
    full_name: profile.full_name,
    company_name: profile.company_name,
    role
  });
  return "Account";
}

/**
 * Gets the fallback initial for avatar
 * Uses the same context-aware logic as getDisplayName to determine which initial to show
 * 
 * @param profile - User profile data
 * @param role - Current user role
 * @param context - Display context
 * @returns Single uppercase letter
 */
export function getFallbackInitial(
  profile: { full_name: string | null; company_name: string | null; email?: string | null } | null | undefined,
  role?: 'admin' | 'supplier' | 'buyer',
  context: DisplayContext = 'navigation'
): string {
  if (!profile) return "A";

  // Messaging context: Always use personal name initial
  if (context === 'messaging') {
    if (isValidName(profile.full_name)) {
      return profile.full_name!.trim().charAt(0).toUpperCase();
    }
    if (profile.company_name?.trim()) {
      return profile.company_name.trim().charAt(0).toUpperCase();
    }
  }

  // Marketplace/Profile context: Use company initial for suppliers
  if ((context === 'marketplace' || context === 'profile') && role === 'supplier') {
    if (profile.company_name?.trim()) {
      return profile.company_name.trim().charAt(0).toUpperCase();
    }
    if (isValidName(profile.full_name)) {
      return profile.full_name!.trim().charAt(0).toUpperCase();
    }
  }
  
  // Navigation context or default: Use personal name initial for buyers/admins, company for suppliers
  if (role === 'supplier') {
    if (profile.company_name?.trim()) {
      return profile.company_name.trim().charAt(0).toUpperCase();
    }
    if (isValidName(profile.full_name)) {
      return profile.full_name!.trim().charAt(0).toUpperCase();
    }
  }
  
  // For buyers/admins: prioritize full_name initial
  if (isValidName(profile.full_name)) {
    return profile.full_name!.trim().charAt(0).toUpperCase();
  }
  if (profile.company_name?.trim()) {
    return profile.company_name.trim().charAt(0).toUpperCase();
  }
  
  // Final fallback
  return "A";
}

/**
 * Gets the display image URL (avatar or company logo)
 * Context-aware to show appropriate image based on where it's displayed
 * 
 * Best practices:
 * - Marketplace: Suppliers show company logo, Buyers show company logo (if available) or personal photo
 * - Messaging: All users show personal photo (more human, builds trust)
 * - Profile: Show appropriate image based on role
 * - Navigation: Show based on role conventions
 * 
 * @param profile - User profile data
 * @param role - Current user role
 * @param context - Display context
 * @returns Image URL or null
 */
export function getDisplayImage(
  profile: { avatar_url: string | null; company_logo_url: string | null } | null | undefined,
  role?: 'admin' | 'supplier' | 'buyer',
  context: DisplayContext = 'navigation'
): string | null {
  if (!profile) return null;

  // MESSAGING CONTEXT: Always show personal photo (more human, builds trust in private communication)
  if (context === 'messaging') {
    return profile.avatar_url || profile.company_logo_url || null;
  }

  // MARKETPLACE CONTEXT: Show company branding
  if (context === 'marketplace') {
    // Suppliers: Always show company logo (branding is critical)
    if (role === 'supplier') {
      return profile.company_logo_url || profile.avatar_url || null;
    }
    // Buyers: Show company logo if available, otherwise personal photo
    if (role === 'buyer') {
      return profile.company_logo_url || profile.avatar_url || null;
    }
    // Admins: Show personal photo
    if (role === 'admin') {
      return profile.avatar_url || profile.company_logo_url || null;
    }
  }

  // PROFILE CONTEXT: Show appropriate image based on role
  if (context === 'profile') {
    // Suppliers: Show company logo prominently
    if (role === 'supplier') {
      return profile.company_logo_url || profile.avatar_url || null;
    }
    // Buyers/Admins: Show personal photo
    return profile.avatar_url || profile.company_logo_url || null;
  }

  // NAVIGATION CONTEXT (default): Show based on role conventions
  // Suppliers: Company logo (branding)
  if (role === 'supplier') {
    return profile.company_logo_url || profile.avatar_url || null;
  }
  
  // Buyers: Company logo if available, otherwise personal photo
  if (role === 'buyer') {
    return profile.company_logo_url || profile.avatar_url || null;
  }
  
  // Admins: Personal photo
  return profile.avatar_url || profile.company_logo_url || null;
}

/**
 * Formats a location string from city, state, and country fields
 * @param profile - Profile object with city, state, and country fields (can be null/undefined)
 * @returns Formatted location string or null if no location data
 */
export function formatLocation(profile: {
  city?: string | null;
  state?: string | null;
  country?: string | null;
} | null | undefined): string | null {
  if (!profile) return null;
  const parts = [profile.city, profile.state, profile.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

/**
 * Formats a number in compact notation (e.g., 128K, 1.2M)
 * Used for displaying large numbers in a readable format
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted string (e.g., "$128K", "1.2M")
 */
export function formatCompactNumber(
  value: number,
  options?: {
    prefix?: string; // e.g., "$"
    suffix?: string; // e.g., "%"
    decimals?: number; // Number of decimal places (default: 1)
    minValue?: number; // Don't compact if below this value (default: 1000)
  }
): string {
  const {
    prefix = '',
    suffix = '',
    decimals = 1,
    minValue = 1000,
  } = options || {};

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  // Don't compact small numbers
  if (absValue < minValue) {
    return `${sign}${prefix}${absValue.toLocaleString()}${suffix}`;
  }

  // Format in thousands (K)
  if (absValue < 1000000) {
    const formatted = (absValue / 1000).toFixed(decimals);
    // Remove trailing zeros and decimal point if not needed
    const clean = parseFloat(formatted).toString();
    return `${sign}${prefix}${clean}K${suffix}`;
  }

  // Format in millions (M)
  if (absValue < 1000000000) {
    const formatted = (absValue / 1000000).toFixed(decimals);
    const clean = parseFloat(formatted).toString();
    return `${sign}${prefix}${clean}M${suffix}`;
  }

  // Format in billions (B)
  const formatted = (absValue / 1000000000).toFixed(decimals);
  const clean = parseFloat(formatted).toString();
  return `${sign}${prefix}${clean}B${suffix}`;
}

/**
 * Formats a number as currency (USD)
 * @param value - The number to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
