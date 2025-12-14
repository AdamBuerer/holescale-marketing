import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useSupplierComparison() {
  const [comparisonList, setComparisonList] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('supplier_comparison');
    if (stored) {
      setComparisonList(JSON.parse(stored));
    }
  }, []);

  const addToComparison = (supplierId: string, supplierName: string) => {
    if (comparisonList.includes(supplierId)) {
      toast.info("Supplier already in comparison");
      return;
    }
    
    if (comparisonList.length >= 4) {
      toast.error("Maximum 4 suppliers can be compared");
      return;
    }

    const updated = [...comparisonList, supplierId];
    localStorage.setItem('supplier_comparison', JSON.stringify(updated));
    setComparisonList(updated);
    toast.success(`${supplierName} added to comparison`);
  };

  const removeFromComparison = (supplierId: string) => {
    const updated = comparisonList.filter(id => id !== supplierId);
    localStorage.setItem('supplier_comparison', JSON.stringify(updated));
    setComparisonList(updated);
    toast.success("Removed from comparison");
  };

  const clearComparison = () => {
    localStorage.removeItem('supplier_comparison');
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
