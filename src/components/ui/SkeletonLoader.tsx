interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'avatar' | 'image' | 'button' | 'input';
  count?: number;
  className?: string;
  lines?: number;
}

export default function SkeletonLoader({
  variant = 'text',
  count = 1,
  className = '',
  lines = 1
}: SkeletonLoaderProps) {
  const baseClass = 'animate-pulse bg-gray-200 rounded';

  const variants = {
    text: 'h-4 w-full',
    card: 'h-32 w-full',
    avatar: 'h-12 w-12 rounded-full',
    image: 'h-48 w-full',
    button: 'h-10 w-24',
    input: 'h-10 w-full',
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClass} ${variants.text} ${
              i === lines - 1 ? 'w-3/4' : ''
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${baseClass} ${variants[variant]}`} />
      ))}
    </div>
  );
}
