import { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

interface FormErrorProps {
  title?: string;
  message: string;
  type?: "error" | "warning" | "info" | "success";
}

/**
 * Reusable form error/success message component
 * Displays validation errors and success messages with appropriate styling
 */
export const FormMessage = ({ title, message, type = "error" }: FormErrorProps) => {
  const icons = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle2,
  };

  const Icon = icons[type];

  const variants = {
    error: "destructive",
    warning: "default",
    info: "default",
    success: "default",
  } as const;

  return (
    <Alert variant={variants[type]} className="mb-4">
      <Icon className="h-4 w-4" aria-hidden="true" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

interface FormFieldErrorProps {
  message?: string;
  id: string;
}

/**
 * Inline field-level error message component
 * Used for individual form field validation errors
 */
export const FormFieldError = ({ message, id }: FormFieldErrorProps) => {
  if (!message) return null;

  return (
    <p id={id} className="text-sm text-destructive mt-1 flex items-start gap-1" role="alert">
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
};

interface FormFieldWrapperProps {
  children: ReactNode;
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
}

/**
 * Complete form field wrapper with label, input, error, and hint
 * Provides consistent styling and accessibility
 */
export const FormFieldWrapper = ({
  children,
  label,
  htmlFor,
  required = false,
  error,
  hint,
}: FormFieldWrapperProps) => {
  const errorId = `${htmlFor}-error`;
  const hintId = `${htmlFor}-hint`;

  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </label>
      {children}
      {error && <FormFieldError message={error} id={errorId} />}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
};
