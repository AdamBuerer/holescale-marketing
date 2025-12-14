import { BrandedLoadingSimple } from './BrandedLoadingSimple';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export default function LoadingSpinner({
  size = 'md',
  className = '',
  message
}: LoadingSpinnerProps) {
  return (
    <div className={className}>
      <BrandedLoadingSimple
        size={size}
        message={message}
        variant="default"
      />
    </div>
  );
}
