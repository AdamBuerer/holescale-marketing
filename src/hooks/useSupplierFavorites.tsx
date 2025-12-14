import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSupplierFavorites(userId: string | undefined) {
  const [favoriteSupplierIds, setFavoriteSupplierIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadFavorites = async () => {
    if (!userId) return;
    
    const { data } = await supabase
      .from("favorites")
      .select("supplier_id")
      .eq("user_id", userId);

    if (data) {
      setFavoriteSupplierIds(new Set(data.map(f => f.supplier_id)));
    }
    setLoading(false);
  };

  const toggleFavorite = async (supplierId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    const isFavorited = favoriteSupplierIds.has(supplierId);

    if (isFavorited) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("supplier_id", supplierId);

      if (!error) {
        setFavoriteSupplierIds(prev => {
          const updated = new Set(prev);
          updated.delete(supplierId);
          return updated;
        });
        toast({
          title: "Removed from favorites",
          description: "Supplier removed from your favorites",
        });
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, supplier_id: supplierId });

      if (!error) {
        setFavoriteSupplierIds(prev => new Set(prev).add(supplierId));
        toast({
          title: "Added to favorites",
          description: "Supplier added to your favorites",
        });
      }
    }
  };

  const isFavorited = (supplierId: string) => favoriteSupplierIds.has(supplierId);

  return {
    favoriteSupplierIds,
    loading,
    toggleFavorite,
    isFavorited,
  };
}
