import { cn } from "@/lib/utils";

export interface BrandedLoadingBoxProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  variant?: 'default' | 'subtle' | 'vibrant';
  className?: string;
  fullScreen?: boolean;
}

export function BrandedLoadingBox({
  size = 'md',
  message,
  variant = 'default',
  className = '',
  fullScreen = false
}: BrandedLoadingBoxProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white z-50 flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={cn(containerClasses, className)}>
      <div className={cn('border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin', sizeClasses[size])} />
      {message && (
        <p className={cn('text-gray-600 text-center mt-4', textSizes[size])}>
          {message}
        </p>
      )}
    </div>
  );
}

export default BrandedLoadingBox;
