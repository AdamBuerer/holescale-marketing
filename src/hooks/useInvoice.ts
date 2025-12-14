import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useInvoice(orderId: string) {
  return useQuery({
    queryKey: ["invoice", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoice_history")
        .select("*")
        .eq("order_id", orderId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data || null;
    },
    enabled: !!orderId,
  });
}
