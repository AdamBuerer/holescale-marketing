import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Progress Stepper Component
 * Visual progress indicator for multi-step processes
 * 
 * Usage:
 * <ProgressStepper
 *   steps={['Basic Info', 'Requirements', 'Files', 'Review']}
 *   currentStep={1}
 * />
 */

interface ProgressStepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
  className?: string;
}

export function ProgressStepper({ steps, currentStep, className }: ProgressStepperProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <li
              key={step}
              className={cn(
                "flex items-center",
                index < steps.length - 1 ? "flex-1" : ""
              )}
            >
              <div className="flex flex-col items-center relative">
                {/* Step circle */}
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 flex-shrink-0",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isCurrent && "border-primary bg-background text-primary scale-110",
                    isUpcoming && "border-muted bg-background text-muted-foreground"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center whitespace-nowrap transition-colors",
                    isCompleted && "text-primary",
                    isCurrent && "text-foreground font-semibold",
                    isUpcoming && "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-200",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Progress percentage for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
      </div>
    </nav>
  );
}

/**
 * Compact Progress Stepper
 * Simplified version for mobile or tight spaces
 */
interface CompactProgressStepperProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export function CompactProgressStepper({ 
  totalSteps, 
  currentStep, 
  className 
}: CompactProgressStepperProps) {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Text indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-muted-foreground">
          {Math.round(progressPercentage)}% complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        />
      </div>
    </div>
  );
}
