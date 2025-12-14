import { ReactNode } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface FormFieldEnhancedProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'textarea';
  placeholder?: string;
  error?: string;
  hint?: string;
  success?: boolean;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  showCount?: boolean;
  icon?: ReactNode;
  className?: string;
}

export function FormFieldEnhanced({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  hint,
  success,
  required,
  disabled,
  maxLength,
  showCount,
  icon,
  className,
}: FormFieldEnhancedProps) {
  const hasError = !!error;
  const characterCount = value?.length || 0;
  const isNearLimit = maxLength && characterCount > maxLength * 0.8;

  const InputComponent = type === 'textarea' ? Textarea : Input;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}

        <InputComponent
          id={name}
          name={name}
          type={type === 'textarea' ? undefined : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(
            'transition-all duration-200',
            icon && 'pl-10',
            hasError && 'border-destructive focus-visible:ring-destructive',
            success && 'border-green-500 focus-visible:ring-green-500',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${name}-error` : hint ? `${name}-hint` : undefined
          }
        />

        {/* Success/Error Icons */}
        {(success || hasError) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-scale-in">
            {success && !hasError && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            {hasError && <AlertCircle className="h-5 w-5 text-destructive" />}
          </div>
        )}
      </div>

      {/* Character Count */}
      {showCount && maxLength && (
        <div className="flex justify-end">
          <span
            className={cn(
              'text-xs transition-colors',
              isNearLimit ? 'text-amber-600 font-medium' : 'text-muted-foreground',
              characterCount >= maxLength && 'text-destructive font-semibold'
            )}
          >
            {characterCount}/{maxLength}
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          id={`${name}-error`}
          className="flex items-start gap-2 text-sm text-destructive animate-fade-in"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hint Message */}
      {hint && !error && (
        <div
          id={`${name}-hint`}
          className="flex items-start gap-2 text-sm text-muted-foreground"
        >
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
}
