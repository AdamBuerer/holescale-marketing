import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface SuccessAnimationProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
  variant?: "check" | "confetti" | "sparkle";
}

export function SuccessAnimation({
  show,
  message = "Success!",
  onComplete,
  variant = "check",
}: SuccessAnimationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);

      // Trigger confetti for major successes
      if (variant === "confetti") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981"],
        });
      }

      // Auto-hide after animation
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, variant, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-in zoom-in-50 fade-in duration-300">
        <div className="bg-card border rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm">
          {variant === "check" && (
            <div className="relative">
              <CheckCircle2 className="h-20 w-20 text-green-500 animate-in zoom-in-50" />
              <div className="absolute inset-0 animate-ping opacity-20">
                <CheckCircle2 className="h-20 w-20 text-green-500" />
              </div>
            </div>
          )}
          
          {variant === "sparkle" && (
            <div className="relative">
              <Sparkles className="h-20 w-20 text-yellow-500 animate-pulse" />
            </div>
          )}

          <p className="text-lg font-semibold text-center animate-in slide-in-from-bottom-4 fade-in duration-500">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

// Hook for easy usage
export function useSuccessAnimation() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("Success!");
  const [variant, setVariant] = useState<"check" | "confetti" | "sparkle">("check");

  const trigger = (
    msg = "Success!",
    animVariant: "check" | "confetti" | "sparkle" = "check"
  ) => {
    setMessage(msg);
    setVariant(animVariant);
    setShow(true);
  };

  const component = (
    <SuccessAnimation
      show={show}
      message={message}
      variant={variant}
      onComplete={() => setShow(false)}
    />
  );

  return { trigger, component };
}
