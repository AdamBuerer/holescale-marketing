import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: number;
  billingCycle: "monthly" | "annual";
  features: string[];
  cta: string;
  ctaAction: () => void;
  popular?: boolean;
  description?: string;
  annualDiscount?: number;
}

export function PricingCard({
  name,
  price,
  billingCycle,
  features,
  cta,
  ctaAction,
  popular = false,
  description,
  annualDiscount = 0.20,
}: PricingCardProps) {
  const annualPrice = price * 12 * (1 - annualDiscount);
  const displayPrice = billingCycle === "annual" ? annualPrice / 12 : price;
  const savings = billingCycle === "annual" ? price * 12 - annualPrice : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative rounded-xl border-2 p-8 shadow-lg bg-card h-full flex flex-col",
        popular
          ? "border-primary shadow-primary/20 bg-gradient-to-br from-card to-primary/5"
          : "border-border hover:border-primary/50"
      )}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          Most Popular
        </div>
      )}

      <div className="flex flex-col h-full">
        <div>
          <h3 className="text-2xl font-bold">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <div className="space-y-1 mt-4">
          <div className="flex items-baseline gap-2">
            {price === 0 ? (
              <span className="text-5xl font-bold">Free</span>
            ) : (
              <>
                <span className="text-5xl font-bold">${displayPrice.toFixed(0)}</span>
                <span className="text-muted-foreground">/month</span>
              </>
            )}
          </div>
          {billingCycle === "annual" && price > 0 && (
            <p className="text-sm text-green-600 font-semibold">
              Save ${savings.toFixed(0)}/year ({Math.round(annualDiscount * 100)}% off)
            </p>
          )}
          {billingCycle === "monthly" && price > 0 && (
            <p className="text-sm text-muted-foreground">
              Billed ${price * 12}/year
            </p>
          )}
        </div>

        <Button
          onClick={ctaAction}
          className="w-full mt-6"
          size="lg"
          variant={popular ? "default" : "outline"}
        >
          {cta}
        </Button>

        <div className="pt-6 space-y-3 flex-1">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
