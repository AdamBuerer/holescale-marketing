import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useProductFavorites(userId: string | undefined) {
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<string>>(new Set());
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
      .from("favorite_products")
      .select("product_id")
      .eq("user_id", userId);

    if (data) {
      setFavoriteProductIds(new Set(data.map(f => f.product_id)));
    }
    setLoading(false);
  };

  const toggleFavorite = async (productId: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    const isFavorited = favoriteProductIds.has(productId);

    if (isFavorited) {
      const { error } = await supabase
        .from("favorite_products")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (!error) {
        setFavoriteProductIds(prev => {
          const updated = new Set(prev);
          updated.delete(productId);
          return updated;
        });
        toast({
          title: "Removed from favorites",
          description: "Product removed from your favorites",
        });
      }
    } else {
      const { error } = await supabase
        .from("favorite_products")
        .insert({ user_id: userId, product_id: productId });

      if (!error) {
        setFavoriteProductIds(prev => new Set(prev).add(productId));
        toast({
          title: "Added to favorites",
          description: "Product added to your favorites",
        });
      }
    }
  };

  const isFavorited = (productId: string) => favoriteProductIds.has(productId);

  return {
    favoriteProductIds,
    loading,
    toggleFavorite,
    isFavorited,
  };
}
