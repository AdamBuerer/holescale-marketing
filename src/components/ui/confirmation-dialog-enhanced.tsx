import { ReactNode, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import { Input } from './input';
import { Label } from './label';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationDialogEnhancedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  variant?: 'default' | 'destructive' | 'warning' | 'info';
  requireConfirmation?: boolean;
  confirmationText?: string;
  loading?: boolean;
  children?: ReactNode;
}

const variantConfig = {
  default: {
    icon: Info,
    iconClass: 'text-blue-600',
    bgClass: 'bg-blue-50 dark:bg-blue-950',
  },
  destructive: {
    icon: AlertTriangle,
    iconClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-600',
    bgClass: 'bg-amber-50 dark:bg-amber-950',
  },
  info: {
    icon: CheckCircle,
    iconClass: 'text-green-600',
    bgClass: 'bg-green-50 dark:bg-green-950',
  },
};

export function ConfirmationDialogEnhanced({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
  requireConfirmation = false,
  confirmationText = 'DELETE',
  loading = false,
  children,
}: ConfirmationDialogEnhancedProps) {
  const [inputValue, setInputValue] = useState('');
  const config = variantConfig[variant];
  const Icon = config.icon;

  const isConfirmDisabled =
    loading || (requireConfirmation && inputValue !== confirmationText);

  const handleConfirm = async () => {
    await onConfirm();
    setInputValue('');
  };

  const handleCancel = () => {
    setInputValue('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="animate-scale-in">
        <AlertDialogHeader>
          <div className={cn('rounded-full w-12 h-12 flex items-center justify-center mb-4', config.bgClass)}>
            <Icon className={cn('h-6 w-6', config.iconClass)} />
          </div>
          <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {requireConfirmation && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="confirmation-input" className="font-medium">
              Type <span className="font-mono font-bold">{confirmationText}</span> to confirm
            </Label>
            <Input
              id="confirmation-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmationText}
              className={cn(
                'transition-colors',
                requireConfirmation && inputValue !== confirmationText && inputValue.length > 0 &&
                  'border-destructive'
              )}
              autoComplete="off"
              autoFocus
            />
          </div>
        )}

        {children}

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel onClick={handleCancel} disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={cn(
              'transition-all duration-200',
              variant === 'destructive' &&
                'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            )}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
