import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  description: string;
  detail?: string;
  icon?: ReactNode;
}

interface StepTimelineProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function StepTimeline({
  steps,
  orientation = 'vertical',
  className,
}: StepTimelineProps) {
  const isHorizontal = orientation === 'horizontal';

  if (isHorizontal) {
    return (
      <div className={cn('py-12 md:py-16', className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0" />
                )}

                <div className="relative z-10">
                  {/* Step number/icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                    {step.icon || step.number}
                  </div>

                  <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                  <p className="text-muted-foreground mb-2">{step.description}</p>
                  {step.detail && (
                    <p className="text-sm text-muted-foreground">{step.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vertical timeline
  return (
    <div className={cn('py-12 md:py-16', className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative flex gap-6 md:gap-8">
                {/* Step number/icon */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg relative z-10">
                    {step.icon || step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-12 md:pb-0">
                  <h4 className="text-xl md:text-2xl font-semibold mb-2">{step.title}</h4>
                  <p className="text-lg text-muted-foreground mb-2">{step.description}</p>
                  {step.detail && (
                    <p className="text-sm text-muted-foreground mt-2">{step.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

