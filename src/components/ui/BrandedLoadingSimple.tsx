import { cn } from "@/lib/utils";

export interface BrandedLoadingSimpleProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  variant?: 'default' | 'subtle' | 'white';
  className?: string;
}

export function BrandedLoadingSimple({
  size = 'md',
  message,
  variant = 'default',
  className = '',
}: BrandedLoadingSimpleProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const messageSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className={cn('border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin', sizeClasses[size])} />
      {message && (
        <p className={cn('text-gray-600 text-center', messageSizes[size])}>
          {message}
        </p>
      )}
    </div>
  );
}

export default BrandedLoadingSimple;
