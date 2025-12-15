import { Shield, MapPin, CreditCard, Lock, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadge {
  icon: React.ReactNode;
  label: string;
  description?: string;
}

interface TrustBadgesProps {
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  badges?: TrustBadge[];
}

const defaultBadges: TrustBadge[] = [
  {
    icon: <MapPin className="w-4 h-4" />,
    label: 'Colorado, USA',
    description: 'US-based company',
  },
  {
    icon: <Shield className="w-4 h-4" />,
    label: 'Verified Suppliers',
    description: 'Pre-vetted network',
  },
  {
    icon: <CreditCard className="w-4 h-4" />,
    label: 'Stripe Payments',
    description: 'Secure transactions',
  },
  {
    icon: <Lock className="w-4 h-4" />,
    label: 'SOC 2 Compliant',
    description: 'Enterprise security',
  },
];

/**
 * TrustBadges Component for E-E-A-T Signals
 *
 * Displays trust indicators to establish credibility with users and search engines.
 * Helps demonstrate Experience, Expertise, Authoritativeness, and Trustworthiness.
 */
export function TrustBadges({
  className,
  variant = 'default',
  badges = defaultBadges,
}: TrustBadgesProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground', className)}>
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-1.5">
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 border border-border/50"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
              {badge.icon}
            </div>
            <span className="font-medium text-sm">{badge.label}</span>
            {badge.description && (
              <span className="text-xs text-muted-foreground mt-1">{badge.description}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Default variant - horizontal badges
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-3 md:gap-6', className)}>
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50 border border-border/50 text-sm"
        >
          <span className="text-primary">{badge.icon}</span>
          <span className="font-medium">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

export default TrustBadges;
