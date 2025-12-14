import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { Loader2 } from "lucide-react";

interface CommissionRate {
  order_min: number;
  order_max: number | null;
  base_rate: number;
}

interface CommissionRateBoxProps {
  tierName: string;
  userType: "supplier" | "buyer";
}

export const CommissionRateBox = ({ tierName, userType }: CommissionRateBoxProps) => {
  const [rates, setRates] = useState<CommissionRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRates();
  }, [tierName, userType]);

  const loadRates = async () => {
    try {
      const { data, error } = await supabase
        .from("commission_rates")
        .select("order_min, order_max, base_rate")
        .eq("tier_name", tierName)
        .eq("user_type", userType)
        .order("order_min", { ascending: true });

      if (error) throw error;
      setRates(data || []);
    } catch (error) {
      logger.error("Error loading commission rates", { error });
    } finally {
      setLoading(false);
    }
  };

  const formatRange = (min: number, max: number | null) => {
    const formatNum = (num: number) => {
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
      return `$${num}`;
    };

    if (max === null) return `${formatNum(min)}+`;
    return `${formatNum(min)}-${formatNum(max)}`;
  };

  if (loading) {
    return (
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <Loader2 className="w-4 h-4 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }

  if (rates.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-muted/30 to-muted/10 border border-border rounded-lg p-4 space-y-2">
      <p className="text-sm font-semibold text-foreground">Transaction Fees:</p>
      {rates.map((rate, index) => (
        <div key={index} className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            {formatRange(rate.order_min, rate.order_max)}
          </span>
          <span className="font-semibold text-foreground">
            {rate.base_rate}%
          </span>
        </div>
      ))}
      {tierName === "enterprise" && (
        <p className="text-xs text-primary font-medium pt-1">
          Custom rates available →
        </p>
      )}
    </div>
  );
};
