import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  filters: Record<string, unknown>;
  created_at: string;
}

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    const filters = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    setSavedSearches(filters);
    setLoading(false);
  };

  const saveSearch = async (name: string, filters: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please log in to save searches");
      return;
    }

    const newSearch: SavedSearch = {
      id: crypto.randomUUID(),
      user_id: session.user.id,
      name,
      filters,
      created_at: new Date().toISOString(),
    };

    const current = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    const updated = [...current, newSearch];
    localStorage.setItem('saved_searches', JSON.stringify(updated));
    setSavedSearches(updated);
    toast.success("Search saved successfully");
  };

  const deleteSearch = async (id: string) => {
    const current = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    const updated = current.filter((s: SavedSearch) => s.id !== id);
    localStorage.setItem('saved_searches', JSON.stringify(updated));
    setSavedSearches(updated);
    toast.success("Search deleted");
  };

  return { savedSearches, loading, saveSearch, deleteSearch };
}
