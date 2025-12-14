import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useProductComparison() {
  const [comparisonList, setComparisonList] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('product_comparison');
    if (stored) {
      setComparisonList(JSON.parse(stored));
    }
  }, []);

  const addToComparison = (productId: string) => {
    if (comparisonList.includes(productId)) {
      toast.info("Product already in comparison");
      return;
    }
    
    if (comparisonList.length >= 4) {
      toast.error("Maximum 4 products can be compared");
      return;
    }

    const updated = [...comparisonList, productId];
    localStorage.setItem('product_comparison', JSON.stringify(updated));
    setComparisonList(updated);
    toast.success("Added to comparison");
  };

  const removeFromComparison = (productId: string) => {
    const updated = comparisonList.filter(id => id !== productId);
    localStorage.setItem('product_comparison', JSON.stringify(updated));
    setComparisonList(updated);
    toast.success("Removed from comparison");
  };

  const clearComparison = () => {
    localStorage.removeItem('product_comparison');
    setComparisonList([]);
    toast.success("Comparison cleared");
  };

  return {
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
  };
}
