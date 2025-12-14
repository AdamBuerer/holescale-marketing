import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import logoDark from '@/assets/logo-dark.png';
import logoLight from '@/assets/logo-light.png';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  width?: number;
}

export function Logo({ variant = 'dark', className, width = 140 }: LogoProps) {
  const { theme, systemTheme } = useTheme();
  
  let logoSrc = logoDark;
  
  if (variant === 'auto') {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    logoSrc = currentTheme === 'dark' ? logoLight : logoDark;
  } else if (variant === 'light') {
    logoSrc = logoLight;
  }
  
  return (
    <img
      src={logoSrc}
      alt="HoleScale"
      width={width}
      height={Math.round(width * 0.4)}
      className={cn('h-auto object-contain', className)}
      style={{ width: `${width}px` }}
    />
  );
}
