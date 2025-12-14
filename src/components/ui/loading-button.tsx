import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from './button';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  success?: boolean;
  loadingText?: string;
  successText?: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LoadingButton({
  loading,
  success,
  loadingText,
  successText,
  icon,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  const isDisabled = disabled || loading || success;

  return (
    <Button
      disabled={isDisabled}
      className={cn(
        'relative transition-all duration-200',
        success && 'bg-green-600 hover:bg-green-700',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'flex items-center gap-2 transition-opacity duration-200',
          (loading || success) && 'opacity-0'
        )}
      >
        {icon}
        {children}
      </span>

      {loading && (
        <span className="absolute inset-0 flex items-center justify-center gap-2 animate-fade-in">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText && <span>{loadingText}</span>}
        </span>
      )}

      {success && (
        <span className="absolute inset-0 flex items-center justify-center gap-2 animate-scale-in">
          <Check className="h-4 w-4" />
          {successText && <span>{successText}</span>}
        </span>
      )}
    </Button>
  );
}
